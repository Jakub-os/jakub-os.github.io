const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT_DIR = __dirname;
loadLocalEnvFile(path.join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";
const MAX_BODY_SIZE = 32 * 1024;
const DUPLICATE_WINDOW_MS = 15 * 1000;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

const recentSubmissions = new Map();

if (!BREVO_API_KEY) {
  console.warn("BREVO_API_KEY is not set. Form submissions will fail until the environment variable is provided.");
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (requestUrl.pathname === "/api/newsletter") {
      await handleApiRequest(req, res, "newsletter");
      return;
    }

    if (requestUrl.pathname === "/api/contact") {
      await handleApiRequest(req, res, "contact");
      return;
    }

    await serveStaticFile(requestUrl.pathname, res);
  } catch (error) {
    console.error("Unexpected server error:", error);
    sendJson(res, 500, {
      ok: false,
      error: "Unexpected server error."
    });
  }
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});

async function handleApiRequest(req, res, formType) {
  let requestBody;
  let payload;

  if (req.method !== "POST") {
    sendJson(res, 405, {
      ok: false,
      error: "Method not allowed."
    });
    return;
  }

  if (!BREVO_API_KEY) {
    sendJson(res, 500, {
      ok: false,
      error: "Server is missing the Brevo API key."
    });
    return;
  }

  try {
    requestBody = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error.message
    });
    return;
  }

  payload = formType === "newsletter" ? validateNewsletterPayload(requestBody) : validateContactPayload(requestBody);

  if (!payload.ok) {
    sendJson(res, payload.statusCode, {
      ok: false,
      error: payload.error
    });
    return;
  }

  const submissionKey = createSubmissionKey(formType, payload.value);
  const duplicateState = getDuplicateState(submissionKey);

  if (duplicateState) {
    sendJson(res, 202, {
      ok: true,
      duplicate: true
    });
    return;
  }

  rememberSubmission(submissionKey, "pending");

  try {
    await upsertBrevoContact(payload.value);
    rememberSubmission(submissionKey, "completed");

    sendJson(res, 200, {
      ok: true
    });
  } catch (error) {
    recentSubmissions.delete(submissionKey);
    console.error(`Brevo ${formType} submission failed:`, error.message);

    sendJson(res, 502, {
      ok: false,
      error: "Submission failed. Please try again."
    });
  }
}

function validateNewsletterPayload(body) {
  const email = normalizeEmail(body.email);

  if (!isValidEmail(email)) {
    return {
      ok: false,
      statusCode: 400,
      error: "A valid email address is required."
    };
  }

  return {
    ok: true,
    value: {
      email: email,
      listId: 5,
      attributes: {
        FORM_SOURCE: "newsletter"
      }
    }
  };
}

function validateContactPayload(body) {
  const name = normalizeText(body.name);
  const email = normalizeEmail(body.email);
  const message = normalizeText(body.message);
  const consentPrivacy = body.consentPrivacy === true;
  const consentMarketing = body.consentMarketing === true;

  if (!name) {
    return {
      ok: false,
      statusCode: 400,
      error: "Name is required."
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      statusCode: 400,
      error: "A valid email address is required."
    };
  }

  if (!message) {
    return {
      ok: false,
      statusCode: 400,
      error: "Message is required."
    };
  }

  if (!consentPrivacy) {
    return {
      ok: false,
      statusCode: 400,
      error: "Privacy consent is required."
    };
  }

  return {
    ok: true,
    value: {
      email: email,
      listId: 6,
      attributes: {
        FIRSTNAME: name,
        MESSAGE: message,
        CONTACT_CONSENT: true,
        MARKETING_CONSENT: consentMarketing,
        FORM_SOURCE: "contact"
      }
    }
  };
}

async function upsertBrevoContact(payload) {
  const requestBody = JSON.stringify({
    email: payload.email,
    attributes: payload.attributes,
    listIds: [payload.listId],
    updateEnabled: true
  });

  const response = await makeHttpsJsonRequest(BREVO_CONTACTS_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Api-Key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody)
    }
  }, requestBody);

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return;
  }

  throw new Error(formatBrevoError(response));
}

function makeHttpsJsonRequest(urlString, options, body) {
  return new Promise((resolve, reject) => {
    const request = https.request(urlString, options, (response) => {
      let responseBody = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseBody += chunk;
      });
      response.on("end", () => {
        resolve({
          statusCode: response.statusCode || 500,
          body: responseBody
        });
      });
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

function formatBrevoError(response) {
  try {
    const parsed = JSON.parse(response.body || "{}");
    return parsed.message || parsed.code || `Brevo API returned ${response.statusCode}`;
  } catch (error) {
    return response.body || `Brevo API returned ${response.statusCode}`;
  }
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;

      if (Buffer.byteLength(rawBody) > MAX_BODY_SIZE) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", reject);
  });
}

async function serveStaticFile(requestPath, res) {
  const normalizedPath = requestPath === "/" ? "/index.html" : decodeURIComponent(requestPath);
  const safePath = path.normalize(normalizedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendPlainText(res, 403, "Forbidden");
    return;
  }

  let stat;

  try {
    stat = await fsp.stat(filePath);
  } catch (error) {
    sendPlainText(res, 404, "Not found");
    return;
  }

  if (stat.isDirectory()) {
    filePath = path.join(filePath, "index.html");

    try {
      stat = await fsp.stat(filePath);
    } catch (error) {
      sendPlainText(res, 404, "Not found");
      return;
    }
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stat.size
  });

  fs.createReadStream(filePath).pipe(res);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendPlainText(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSubmissionKey(formType, payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify([formType, payload]))
    .digest("hex");
}

function getDuplicateState(key) {
  cleanupOldSubmissions();

  if (!recentSubmissions.has(key)) {
    return null;
  }

  return recentSubmissions.get(key).state;
}

function rememberSubmission(key, state) {
  cleanupOldSubmissions();
  recentSubmissions.set(key, {
    state: state,
    timestamp: Date.now()
  });
}

function cleanupOldSubmissions() {
  const now = Date.now();

  recentSubmissions.forEach((entry, key) => {
    if (now - entry.timestamp > DUPLICATE_WINDOW_MS) {
      recentSubmissions.delete(key);
    }
  });
}

function loadLocalEnvFile(envFilePath) {
  let contents;

  try {
    contents = fs.readFileSync(envFilePath, "utf8");
  } catch (error) {
    return;
  }

  contents.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    let separatorIndex;
    let key;
    let value;

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    key = trimmedLine.slice(0, separatorIndex).trim();
    value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}
