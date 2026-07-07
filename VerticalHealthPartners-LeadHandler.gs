/**
 * Vertical Health Partners — Lead Handler
 * Receives lead form submissions and:
 *   1) Logs each lead as a row in this Google Sheet
 *   2) Emails the full lead to info@verticalhealthpartners.com
 *   3) Sends a short TEXT alert to your phone for every new lead
 *
 * SETUP: see the numbered steps Anirudha sent in chat.
 */

// ---- SETTINGS (Anirudha will confirm the SMS line once you tell me your carrier) ----
var LEAD_EMAIL = 'info@verticalhealthpartners.com';   // where full leads are emailed
var SMS_TO     = '5162416738@vtext.com';              // phone-as-email for text alerts (carrier gateway)
// Carrier gateways:  Verizon = @vtext.com  |  AT&T = @txt.att.net  |  T-Mobile = @tmomail.net  |  Sprint = @messaging.sprintpcs.com
// -----------------------------------------------------------------------------------

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var name     = p.name     || '';
    var business = p.business || '';
    var btype    = p.type     || '';
    var email    = p.email    || '';
    var phone    = p.phone    || '';
    var message  = p.message  || '';

    // 1) Log to the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date/Time', 'Name', 'Business', 'Business Type', 'Email', 'Phone', 'Message']);
    }
    sheet.appendRow([new Date(), name, business, btype, email, phone, message]);

    // 2) Email the full lead
    var body =
      'New lead from VerticalHealthPartners.com\n\n' +
      'Name: '     + name     + '\n' +
      'Business: ' + business + '\n' +
      'Type: '     + btype    + '\n' +
      'Email: '    + email    + '\n' +
      'Phone: '    + phone    + '\n' +
      'Message: '  + message  + '\n';
    MailApp.sendEmail({ to: LEAD_EMAIL, subject: 'New Lead — ' + (business || name), body: body });

    // 3) Text alert (kept short for SMS)
    if (SMS_TO) {
      var sms = 'New VHP lead: ' + name + ' / ' + business + ' / ' + phone + ' / ' + email;
      MailApp.sendEmail(SMS_TO, 'New Lead', sms.substring(0, 155));
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Vertical Health Partners lead handler is running.');
}
