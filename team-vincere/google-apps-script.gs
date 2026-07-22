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
 *   4. Paste that URL into  var FORM_ENDPOINT = "..."  in
 *      assets/js/site.js  (the CONFIG block at the very top).
 *   5. Redeploy the site. Submissions append as rows. Download any time
 *      via  File > Download > CSV (or Microsoft Excel).
 *
 * Two tabs are auto-created:
 *   Applications  - coaching form (apply.html)
 *   Leads         - free-guide opt-ins, with a Source column so you can see
 *                   where each came from (Free guide, calculator, popup, etc.)
 * ------------------------------------------------------------------
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var d = JSON.parse(e.postData.contents);

    if (d.type === 'lead') {
      // Free-guide lead -> "Leads" tab
      var leads = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
      if (leads.getLastRow() === 0) {
        leads.appendRow(['Timestamp', 'Name', 'Email', 'Source']);
      }
      leads.appendRow([new Date(), d.name || '', d.email || '', d.source || 'Free guide']);
    } else {
      // Coaching application -> "Applications" tab
      var apps = ss.getSheetByName('Applications') || ss.insertSheet('Applications');
      if (apps.getLastRow() === 0) {
        apps.appendRow([
          'Timestamp', 'Name', 'Email', 'Phone', 'Instagram', 'Age',
          'Years training', 'Competed', 'Goal / timeline', 'Training days',
          'Investment', 'Why they should be selected'
        ]);
      }
      apps.appendRow([
        new Date(), d.name || '', d.email || '', d.phone || '', d.social || '',
        d.age || '', d.years || '', d.competed || '', d.goal || '', d.days || '',
        d.budget || '', d.why || ''
      ]);
    }

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
