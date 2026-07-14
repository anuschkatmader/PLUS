# PLUS Supermarket — CMP/UCPM Demo Site

Static demo website styled after the Dutch supermarket chain PLUS, built for a
sales engineering demonstration of a Consent Management Platform (CMP) and
Universal Consent & Preference Management (UCPM) solution.

> **Demo environment only.** Not affiliated with PLUS Retail. All pages carry a
> demo disclaimer and `noindex, nofollow`. Do not present as the real plus.nl.

## What's inside

```
index.html                 Homepage (English, PLUS look & feel)
account.html               Account page for "Anuschka Mader" incl. Preference Center
assets/css/styles.css      All styling (brand tokens at the top)
assets/js/main.js          Header, nav dropdown, newsletter form
assets/js/preferences.js   Account tabs + preference center logic (localStorage)
assets/js/demo-analytics.js  Dummy 3rd-party tag for script-blocking demos
assets/js/demo-ads.js        Dummy 3rd-party tag for script-blocking demos
assets/img/plus-logo.svg   Original demo wordmark (not the official logo)
.gitlab-ci.yml             GitLab Pages deployment
```

No build step, no dependencies. Everything runs client-side.

## Run locally

Either just open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy

**GitHub Pages**
1. Push this repo to GitHub.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → Save.
3. Site appears at `https://<user>.github.io/<repo>/`.

**GitLab Pages**
1. Push this repo to GitLab (default branch).
2. The included `.gitlab-ci.yml` copies the site into `public/` and publishes it.
3. Site appears at `https://<user>.gitlab.io/<repo>/` (see Deploy → Pages).

All links are relative, so subpath hosting works out of the box.

## Wiring in the CMP (cookie banner)

1. Open `index.html` and `account.html`.
2. Find the marked block in the `<head>`:
   ```html
   <!-- ===== ONETRUST CMP SCRIPTS — INSERT HERE ===== -->
   ```
   Paste the OneTrust script tags (from the OneTrust admin console) inside it,
   on **both** pages.
3. The footer link `Cookie Settings` (`id="ot-sdk-btn"`, class
   `ot-sdk-show-settings`) and the "Manage cookie settings" link in the
   preference center will automatically reopen the OneTrust preference center
   once the SDK is loaded.
4. For the **script auto-blocking demo**: two simulated third-party tags load at
   the bottom of `index.html` (`demo-analytics.js`, `demo-ads.js`) and log to
   the browser console. Re-tag them per your CMP categorisation (e.g.
   `type="text/plain"` + the category class) to show them being blocked or
   released based on consent. Check the console / `window.__demoAnalyticsLoaded`
   and `window.__demoAdsLoaded` to prove the point on stage.

## Wiring in UCPM

Every control in **Account → Privacy & Preferences** carries a
`data-purpose-id` attribute (e.g. `email-marketing`, `ad-partner-sharing`,
`frequency`). Today, `assets/js/preferences.js` persists choices to
`localStorage` and appends entries to the on-page consent history table. To
demo live consent receipts, replace the `writeJSON`/`logHistory` calls with the
consent API: map each `data-purpose-id` to a collection point / purpose ID and
submit one transaction per save.

## Demo persona

- **Name:** Anuschka Mader — logged in on both pages ("Hi, Anuschka")
- **Email:** anuschka.mader@example.com
- **PLUS card:** 2600 1234 5678 · member since 2021
- **Home store:** PLUS Amsterdam Centrum

To reset the demo between sessions, clear site data (localStorage keys
`plus-demo-preferences` and `plus-demo-consent-history`).
