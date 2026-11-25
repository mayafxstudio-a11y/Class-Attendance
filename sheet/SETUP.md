# Connect the app to your Google Sheet

1. Create a new Google Sheet. Name it, for example, **Class Attendance**.
2. In the sheet, open **Extensions > Apps Script**.
3. Delete the sample code and paste everything from `Code.gs`.
4. Change `SECRET` on line 14 to any word only you know.
5. Click **Deploy > New deployment**. Choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, approve the permissions, and copy the **Web app** link.
7. In the app, open **Summary > Sync to Google Sheet**. Paste the link and the same secret word, then press **Save and send**.

The sheet then gets four tabs: **Attendance**, **Fees**, **Trainer pay** and **Summary**.
Press the sync button again whenever you want the sheet updated; each sync rewrites the tabs.
On the **Summary** tab, type another month (like `2026-10`) in cell B1 to see that month.

Sync works from the downloaded `index.html` or the GitHub Pages link. It cannot send from inside the Claude preview.

If you change `Code.gs` later, use **Deploy > Manage deployments > Edit > New version** so the same link keeps working.
