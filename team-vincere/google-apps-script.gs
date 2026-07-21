/**
 * Team Vincere — application intake to Google Sheet
 * ------------------------------------------------------------------
 * Setup:
 *   1. Create a Google Sheet (this becomes your applications database).
 *   2. Extensions > Apps Script. Delete any code, paste this file, Save.
 *   3. Deploy > New deployment > type "Web app":
 *        - Execute as:      Me
 *        - Who has access:  Anyone
 *      Deploy, authorize, and COPY the Web app URL (it ends in /exec).
 *   4. Paste that URL into  var FORM_ENDPOINT = "..."  in index.html
 *      (and apply.html if you use it).
 *   5. Redeploy the site. Submissions append as rows. Download any time
 *      via  File > Download > CSV (or Microsoft Excel).
 * ------------------------------------------------------------------
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Applications') || ss.insertSheet('Applications');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Phone', 'Instagram', 'Age',
        'Years training', 'Competed', 'Goal / timeline', 'Training days',
        'Investment', 'Why they should be selected'
      ]);
    }

    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(), d.name || '', d.email || '', d.phone || '', d.social || '',
      d.age || '', d.years || '', d.competed || '', d.goal || '', d.days || '',
      d.budget || '', d.why || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
