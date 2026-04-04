/**
 * Google Apps Script endpoint for website forms.
 * Deploy as Web app with access: Anyone.
 */

const SPREADSHEET_ID = '1_qFFdFn739SxrHWD_S4nsUMIAhVzhzTkd819uX-k99Y';
const NEWSLETTER_SHEET = 'Newsletter';
const CONTACT_SHEET = 'Contact';

function doPost(e) {
  return handleRequest_(e);
}

function doOptions() {
  return createJsonResponse_(200, { ok: true });
}

function handleRequest_(e) {
  try {
    const payload = parseJsonBody_(e);
    const formType = String(payload.form || '').trim().toLowerCase();

    if (formType === 'newsletter') {
      const result = validateNewsletterPayload_(payload);
      if (!result.ok) {
        return createJsonResponse_(400, { ok: false, error: result.error });
      }

      appendNewsletterRow_(result.value);
      return createJsonResponse_(200, { ok: true });
    }

    if (formType === 'contact') {
      const result = validateContactPayload_(payload);
      if (!result.ok) {
        return createJsonResponse_(400, { ok: false, error: result.error });
      }

      appendContactRow_(result.value);
      return createJsonResponse_(200, { ok: true });
    }

    return createJsonResponse_(400, { ok: false, error: 'Invalid form type.' });
  } catch (error) {
    return createJsonResponse_(500, {
      ok: false,
      error: error && error.message ? error.message : 'Unexpected server error.'
    });
  }
}

function validateNewsletterPayload_(payload) {
  const email = normalizeText_(payload.email).toLowerCase();

  if (!isValidEmail_(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }

  return {
    ok: true,
    value: {
      submitted_at: new Date().toISOString(),
      email: email,
      form_source: normalizeText_(payload.form_source) || 'newsletter',
      page_url: normalizeText_(payload.pageUrl)
    }
  };
}

function validateContactPayload_(payload) {
  const name = normalizeText_(payload.name);
  const email = normalizeText_(payload.email).toLowerCase();
  const message = normalizeText_(payload.message);
  const consentPrivacy = payload.consent_privacy === true;
  const consentMarketing = payload.consent_marketing === true;

  if (!name) {
    return { ok: false, error: 'Name is required.' };
  }

  if (!isValidEmail_(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }

  if (!message) {
    return { ok: false, error: 'Message is required.' };
  }

  if (!consentPrivacy) {
    return { ok: false, error: 'Privacy consent is required.' };
  }

  return {
    ok: true,
    value: {
      submitted_at: new Date().toISOString(),
      name: name,
      email: email,
      message: message,
      consent_privacy: consentPrivacy,
      consent_marketing: consentMarketing,
      form_source: normalizeText_(payload.form_source) || 'contact',
      page_url: normalizeText_(payload.pageUrl)
    }
  };
}

function appendNewsletterRow_(data) {
  const sheet = getSheet_(NEWSLETTER_SHEET);
  sheet.appendRow([
    data.submitted_at,
    data.email,
    data.form_source,
    data.page_url
  ]);
}

function appendContactRow_(data) {
  const sheet = getSheet_(CONTACT_SHEET);
  sheet.appendRow([
    data.submitted_at,
    data.name,
    data.email,
    data.message,
    data.consent_privacy,
    data.consent_marketing,
    data.form_source,
    data.page_url
  ]);
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Missing sheet tab: ' + sheetName);
  }

  return sheet;
}

function parseJsonBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing JSON body.');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('Invalid JSON body.');
  }
}

function createJsonResponse_(status, body) {
  const output = ContentService
    .createTextOutput(JSON.stringify({ status: status, ...body }))
    .setMimeType(ContentService.MimeType.JSON);

  // Apps Script Web Apps do not allow custom response headers on ContentService.
  // Returning JSON is sufficient for browser fetch to consume the response body.
  return output;
}

function normalizeText_(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
