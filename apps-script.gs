/**
 * ForAll Sense — Waitlist Google Apps Script
 *
 * SETUP:
 * 1. Create a new Google Sheet, name it "ForAll Sense Waitlist"
 * 2. In row 1, add headers:  Timestamp  |  Email
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire file
 * 5. Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy, authorize when prompted
 * 7. Copy the Web app URL
 * 8. Paste it into js/animations.js where it says SHEET_URL
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = (data.email || '').trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return respond({ status: 'error', message: 'Invalid email' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (emailExists(sheet, email)) {
      return respond({ status: 'duplicate', message: 'You are already on the list' });
    }

    sheet.appendRow([new Date(), email]);
    return respond({ status: 'ok' });
  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailExists(sheet, email) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === email) return true;
  }
  return false;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
