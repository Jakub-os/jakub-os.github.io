const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const ROOT_DIR = __dirname;
const PORT = Number(process.env.PORT) || 3000;

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

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    await serveStaticFile(requestUrl.pathname, res);
  } catch (error) {
    console.error("Unexpected server error:", error);
    sendPlainText(res, 500, "Unexpected server error.");
  }
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});

async function serveStaticFile(requestPath, res) {
  const normalizedPath = requestPath === "/" ? "/index.html" : decodeURIComponent(requestPath);
  const safePath = path.normalize(normalizedPath).replace(/^([.][.][/\\])+/, "");
  const relativePath = safePath.replace(/^[/\\]+/, "");
  let filePath = path.join(ROOT_DIR, relativePath);

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

function sendPlainText(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}
