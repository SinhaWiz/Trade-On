# Selenium Tests

These tests exercise the deployed TradeOn app at:

`https://trade-on-phi.vercel.app`

## Install

```bash
cd tests/selenium
python3 -m pip install -r requirements.txt
```

## Run

```bash
TRADEON_BASE_URL=https://trade-on-phi.vercel.app \
python3 -m unittest test_tradeon.py
```

## Notes

- The suite uses Chrome via Selenium Manager.
- The tests target the deployed site, so the app must be reachable from the machine running the browser.
- OAuth is not completed end-to-end here; the suite focuses on the visible login, demo, gameplay, save, menu, and sign-out flows.

