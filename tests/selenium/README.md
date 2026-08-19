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
TRADEON_BASE_URL=https://trade-on-phi.vercel.app \
node --test ../tests/selenium/tradeon.test.js
```

## Notes

- The suite uses Chrome via Selenium Manager.
- The tests target the deployed site, so the app must be reachable from the machine running the browser.
- OAuth is not completed end-to-end here; the suite focuses on the visible login, demo, gameplay, save, menu, skip-turn, short-position, and sign-out flows.
