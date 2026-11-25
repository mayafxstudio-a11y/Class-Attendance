# Connect the app to your Google Sheet

Everything is inside the app: open the **Settings** tab.

1. Tap **Copy the script**. Your secret word is already in it.
2. In your Google Sheet open **Extensions > Apps Script**, delete what is there, paste, and press **Save**.
3. **Deploy > New deployment > Web app**. Execute as **Me**, access **Anyone**. Approve, then copy the **Web app** link (ends in `/exec`).
4. Paste the link in **Settings > Web app link** and press **Connect**.

The sheet gets **Attendance**, **Fees**, **Trainer pay** and **Summary** tabs. With auto-send on, every change is sent a few seconds later.
On the **Summary** tab, type a month like `2026-10` in cell B1 to see that month.

Works from the GitHub Pages link or the downloaded `index.html`, not inside the Claude preview.
If you change the script later: **Deploy > Manage deployments > Edit > New version**, so the link stays the same.

`Code.gs` here is the same script, for reference.
