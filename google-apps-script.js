/**
 * ImageResizeNow - Google Sheets Form Handler Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) and name it "ImageResizeNow Form Submissions"
 * 2. In Google Sheets menu, click: Extensions -> Apps Script
 * 3. Replace all code in the script editor with this file's code.
 * 4. Click the blue "Deploy" button at the top right -> "New deployment"
 * 5. Under "Select type", choose "Web app"
 * 6. Set the settings:
 *    - Description: ImageResizeNow Web App
 *    - Execute as: Me (<your email>)
 *    - Who has access: Anyone (IMPORTANT: must be "Anyone" so visitors can submit without Google login)
 * 7. Click "Deploy", authorize permissions when prompted.
 * 8. Copy the "Web app URL" (looks like https://script.google.com/macros/s/.../exec)
 * 9. Paste that URL into your .env.local file:
 *    GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

function doPost(e) {
  try {
    var rawContents = e.postData ? e.postData.contents : null;
    if (!rawContents) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No payload received' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(rawContents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();
    
    // 1. Handle Contact Form
    if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('ContactMessages');
      if (!sheet) {
        sheet = ss.insertSheet('ContactMessages');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
        sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([timestamp, data.name, data.email, data.message]);
    } 
    // 2. Handle Rating Form
    else if (data.formType === 'rating') {
      var sheet = ss.getSheetByName('Ratings');
      if (!sheet) {
        sheet = ss.insertSheet('Ratings');
        sheet.appendRow(['Timestamp', 'Rating (Stars)', 'Comment', 'Page']);
        sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#10b981').setFontColor('#ffffff');
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([timestamp, data.rating, data.comment || '', data.page || '/contact']);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Form entry recorded successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ImageResizeNow Google Apps Script is active and listening.")
    .setMimeType(ContentService.MimeType.TEXT);
}
