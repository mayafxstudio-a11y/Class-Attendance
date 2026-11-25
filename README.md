# Class Attendance

A single-file attendance app for classes held in several villages. Open `index.html` in any browser, no install or server needed.

- **Classes**: batches (one per village), today's classes, instructors with photos
- **Students**: plan (monthly or annual), fee, belt, paid-until status, renew button
- **Attendance**: tap to mark present, per day or a month grid
- **Substitute trainers**: pick who took the class, set the pay, mark it paid
- **Summary**: monthly attendance, fees received, trainer pay (classes × rate), plans due
- **Copy to Google Sheets**: attendance, fees and trainer pay as rows to paste at cell A1
- **Settings**: connect a Google Sheet (script built in, auto-send after changes), instructors with photos, backup and restore

Data is saved in the browser on the device you use. Use **Summary > Backup** to copy a backup and **Restore from backup** to load it on another device.

To put it online, enable GitHub Pages for this repository (Settings > Pages > Deploy from branch > `main` / root).
