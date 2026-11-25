/**
 * Class Attendance: Google Sheet receiver.
 *
 * Setup: see SETUP.md. Paste this into Extensions > Apps Script of your sheet,
 * change SECRET, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Copy the web app link into the app.
 *
 * Each sync from the app rewrites these tabs:
 *   Attendance, Fees, Trainer pay, Summary
 */
const SECRET = 'change-this-word';

function doGet() {
  return ContentService.createTextOutput('Class Attendance sheet is ready.');
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput('bad data');
  }
  if (d.token !== SECRET) return ContentService.createTextOutput('denied');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  writeTab_(ss, 'Attendance', d.attendance);
  writeTab_(ss, 'Fees', d.fees);
  writeTab_(ss, 'Trainer pay', d.trainers);
  buildSummary_(ss, d);
  return ContentService.createTextOutput('ok');
}

/** Clears a tab and writes header + rows. Dates stay as text (yyyy-mm-dd). */
function writeTab_(ss, name, rows) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  if (!rows || !rows.length) return;
  const width = rows[0].length;
  sh.getRange(1, 1, rows.length, 1).setNumberFormat('@');
  const clean = rows.map(function (r) {
    return r.map(function (v) {
      return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v;
    });
  });
  sh.getRange(1, 1, clean.length, width).setValues(clean);
  sh.getRange(1, 1, 1, width)
    .setFontWeight('bold').setBackground('#2A2B2F').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, width);
}

/** Summary tab: type a month like 2026-11 in B1 and everything recalculates. */
function buildSummary_(ss, d) {
  const sh = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  const keepMonth = sh.getRange('B1').getValue();
  sh.clear();
  const month = keepMonth ? String(keepMonth) : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');

  sh.getRange('A1').setValue('Month (yyyy-mm)');
  sh.getRange('B1').setNumberFormat('@').setValue(month).setBackground('#F4D9D7').setFontWeight('bold');

  const m = '$B$1&"*"';
  const rows = [
    ['Fees received', '=SUMIFS(Fees!E:E,Fees!A:A,' + m + ')'],
    ['Trainer pay, total', "=SUMIFS('Trainer pay'!D:D,'Trainer pay'!A:A," + m + ')'],
    ['Trainer pay, paid', "=SUMIFS('Trainer pay'!D:D,'Trainer pay'!A:A," + m + ",'Trainer pay'!E:E,\"Yes\")"],
    ['Trainer pay, still to pay', '=B4-B5'],
    ['Left after trainer pay', '=B3-B4'],
    ['Classes taken by trainers', "=COUNTIFS('Trainer pay'!A:A," + m + ')'],
    ['Attendance %', '=IFERROR(COUNTIFS(Attendance!A:A,' + m + ',Attendance!D:D,"Yes")/COUNTIFS(Attendance!A:A,' + m + '),0)']
  ];
  sh.getRange(3, 1, rows.length, 2).setFormulas(rows);
  sh.getRange('B3:B8').setNumberFormat('#,##0');
  sh.getRange('B9').setNumberFormat('0%');

  // By village
  const villages = unique_(d.attendance, 1);
  let r = 12;
  sh.getRange(r, 1, 1, 4).setValues([['Village', 'Attendance %', 'Fees received', 'Trainer pay']]);
  styleHeader_(sh.getRange(r, 1, 1, 4));
  villages.forEach(function (v, i) {
    const row = r + 1 + i;
    sh.getRange(row, 1).setValue(v);
    sh.getRange(row, 2).setFormula('=IFERROR(COUNTIFS(Attendance!A:A,' + m + ',Attendance!B:B,A' + row + ',Attendance!D:D,"Yes")/COUNTIFS(Attendance!A:A,' + m + ',Attendance!B:B,A' + row + '),0)').setNumberFormat('0%');
    sh.getRange(row, 3).setFormula('=SUMIFS(Fees!E:E,Fees!A:A,' + m + ',Fees!C:C,A' + row + ')').setNumberFormat('#,##0');
    sh.getRange(row, 4).setFormula("=SUMIFS('Trainer pay'!D:D,'Trainer pay'!A:A," + m + ",'Trainer pay'!B:B,A" + row + ')').setNumberFormat('#,##0');
  });

  // By trainer: classes x rate = total
  const trainers = unique_(d.trainers, 2);
  r = r + villages.length + 3;
  sh.getRange(r, 1, 1, 5).setValues([['Trainer', 'Classes', 'Total', 'Paid', 'To pay']]);
  styleHeader_(sh.getRange(r, 1, 1, 5));
  trainers.forEach(function (t, i) {
    const row = r + 1 + i;
    sh.getRange(row, 1).setValue(t);
    sh.getRange(row, 2).setFormula("=COUNTIFS('Trainer pay'!A:A," + m + ",'Trainer pay'!C:C,A" + row + ')');
    sh.getRange(row, 3).setFormula("=SUMIFS('Trainer pay'!D:D,'Trainer pay'!A:A," + m + ",'Trainer pay'!C:C,A" + row + ')').setNumberFormat('#,##0');
    sh.getRange(row, 4).setFormula("=SUMIFS('Trainer pay'!D:D,'Trainer pay'!A:A," + m + ",'Trainer pay'!C:C,A" + row + ",'Trainer pay'!E:E,\"Yes\")").setNumberFormat('#,##0');
    sh.getRange(row, 5).setFormula('=C' + row + '-D' + row).setNumberFormat('#,##0');
  });

  sh.getRange('A3:A9').setFontWeight('bold');
  sh.setColumnWidth(1, 200);
  sh.setActiveSheet(sh);
}

function unique_(rows, col) {
  const seen = {};
  const out = [];
  (rows || []).slice(1).forEach(function (r) {
    const v = r[col];
    if (v && !seen[v]) { seen[v] = true; out.push(v); }
  });
  return out;
}

function styleHeader_(range) {
  range.setFontWeight('bold').setBackground('#2A2B2F').setFontColor('#FFFFFF');
}
