# Selenium Tests

These tests exercise the deployed TradeOn app at:

`https://trade-on-phi.vercel.app`

## Install

From `web/`:

```bash
npm install selenium-webdriver
```

## Run

From `web/`:

```bash
npx mocha
```

## Notes

- The suite defaults to Microsoft Edge via Selenium Manager and opens a visible browser by default.
- The tests target the deployed site, so the app must be reachable from the machine running the browser.
- OAuth is not completed end-to-end here; the suite focuses on the visible login, demo, gameplay, save, menu, skip-turn, short-position, and sign-out flows.
- If you want Chrome instead, set `SELENIUM_BROWSER=chrome`.
- If you want headless mode, set `SELENIUM_HEADLESS=1`.
