/**
 * Google Apps Script endpoint for website forms.
 *
 * Deploy as Web App:
 * - Execute as: Me
 * - Who has access: Anyone
 */

const SPREADSHEET_ID = '1_qFFdFn739SxrHWD_S4nsUMIAhVzhzTkd819uX-k99Y';
const NEWSLETTER_SHEET = 'Newsletter';
const CONTACT_SHEET = 'Contact';

function doPost(e) {
  try {
    const payload = parseJsonBody_(e);
    const formType = normalizeText_(payload.form).toLowerCase();

    if (formType === 'newsletter') {
      const newsletter = validateNewsletterPayload_(payload);
      appendNewsletterRow_(newsletter);
      return jsonResponse_({ ok: true });
    }

    if (formType === 'contact') {
      const contact = validateContactPayload_(payload);
      appendContactRow_(contact);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: 'Invalid form type.' });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error && error.message ? error.message : 'Unexpected server error.'
    });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, message: 'Google Apps Script form endpoint is running.' });
}

function validateNewsletterPayload_(payload) {
  const email = normalizeText_(payload.email).toLowerCase();

  if (!isValidEmail_(email)) {
    throw new Error('A valid email is required.');
  }

  return {
    submitted_at: new Date().toISOString(),
    email: email,
    form_source: normalizeText_(payload.form_source) || 'newsletter',
    page_url: normalizeText_(payload.page_url)
  };
}

function validateContactPayload_(payload) {
  const name = normalizeText_(payload.name);
  const email = normalizeText_(payload.email).toLowerCase();
  const message = normalizeText_(payload.message);
  const consent_privacy = payload.consent_privacy === true;
  const consent_marketing = payload.consent_marketing === true;

  if (!name) {
    throw new Error('Name is required.');
  }

  if (!isValidEmail_(email)) {
    throw new Error('A valid email is required.');
  }

  if (!message) {
    throw new Error('Message is required.');
  }

  if (!consent_privacy) {
    throw new Error('Privacy consent is required.');
  }

  return {
    submitted_at: new Date().toISOString(),
    name: name,
    email: email,
    message: message,
    consent_privacy: consent_privacy,
    consent_marketing: consent_marketing,
    form_source: normalizeText_(payload.form_source) || 'contact',
    page_url: normalizeText_(payload.page_url)
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

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeText_(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
