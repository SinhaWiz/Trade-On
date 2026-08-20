const { Builder, By, Browser, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');

const BASE_URL = (process.env.TRADEON_BASE_URL || 'https://trade-on-phi.vercel.app').replace(/\/$/, '');
const LOGIN_URL = `${BASE_URL}/login`;
const DEFAULT_TIMEOUT = 25000;
const BROWSER = (process.env.SELENIUM_BROWSER || 'edge').toLowerCase();
const VISUAL_PAUSE_MS = process.env.SELENIUM_HEADLESS === '1' ? 0 : 3500;

const DEFAULT_COINS = [
  { name: 'Bitcoin', ticker: 'BTC', price: 50000, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: 'Ethereum', ticker: 'ETH', price: 3000, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: 'Binance Coin', ticker: 'BNB', price: 400, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: 'Cardano', ticker: 'ADA', price: 1.5, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: 'Solana', ticker: 'SOL', price: 100, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: 'Dogecoin', ticker: 'DOGE', price: 0.15, possiblePositiveTrend: false, possibleNegativeTrend: false },
].map((coin) => ({
  ...coin,
  previousPrice: coin.price,
  priceHistory: [coin.price],
}));

let driver;

function xpathLiteral(value) {
  if (!value.includes("'")) {
    return `'${value}'`;
  }
  if (!value.includes('"')) {
    return `"${value}"`;
  }
  const parts = value.split("'");
  const pieces = [];
  parts.forEach((part, index) => {
    if (part) {
      pieces.push(`'${part}'`);
    }
    if (index < parts.length - 1) {
      pieces.push(`"'"`);
    }
  });
  return `concat(${pieces.join(', ')})`;
}

async function buildDriver() {
  const headless = process.env.SELENIUM_HEADLESS === '1';
  const builder = new Builder().disableEnvironmentOverrides();

  if (BROWSER === 'chrome') {
    const options = new chrome.Options();
    if (headless) {
      options.addArguments('--headless=new');
    }
    options.addArguments('--window-size=1440,1600');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    return builder
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
  }

  const options = new edge.Options();
  if (headless) {
    options.addArguments('--headless=new');
  }
  options.addArguments('--window-size=1440,1600');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  return builder
    .forBrowser(Browser.EDGE)
    .setEdgeOptions(options)
    .build();
}

async function waitForVisibleXPath(xpath, timeout = DEFAULT_TIMEOUT) {
  const element = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function waitForText(text, timeout = DEFAULT_TIMEOUT) {
  const literal = xpathLiteral(text);
  return waitForVisibleXPath(`//*[contains(normalize-space(.), ${literal})]`, timeout);
}

async function clickText(text, timeout = DEFAULT_TIMEOUT) {
  const literal = xpathLiteral(text);
  const element = await waitForVisibleXPath(
    `//*[self::button or self::a][normalize-space(.)=${literal}]`,
    timeout
  );
  await element.click();
  return element;
}

async function pauseForViewer() {
  if (VISUAL_PAUSE_MS > 0) {
    await driver.sleep(VISUAL_PAUSE_MS);
  }
}

async function dumpPageSnapshot(label) {
  const [url, title, bodyText] = await Promise.all([
    driver.getCurrentUrl(),
    driver.getTitle(),
    driver.findElement(By.css('body')).getText().catch(() => ''),
  ]);

  console.log(`\n[${label}] url: ${url}`);
  console.log(`[${label}] title: ${title}`);
  console.log(`[${label}] body: ${bodyText.slice(0, 1200)}`);
}

async function seedDemoUser() {
  await driver.executeScript(`
    localStorage.setItem('demo-user', JSON.stringify({
      name: 'Demo Trader',
      email: 'demo@trade-on.game',
      image: null
    }));
  `);
}

describe('TradeOn Selenium', function () {
  this.timeout(120000);

  before(async () => {
    driver = await buildDriver();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('demo walkthrough progresses from login to player menu to game view', async () => {
    try {
      await driver.get(LOGIN_URL);
      await pauseForViewer();

      await waitForText('Get Started');
      await waitForText('Continue with Google');
      await waitForText('A simulation game • No real money involved');

      await seedDemoUser();
      await clickText('Get Started');
      await pauseForViewer();
      await waitForText('Start New Game');
      await pauseForViewer();
      await pauseForViewer();
      await clickText('Start New Game');
      await pauseForViewer();
      await pauseForViewer();
      await pauseForViewer();
      await pauseForViewer();
      await waitForText('Market Overview');
      await pauseForViewer();
      await waitForText('Quick Actions');

      const btcTradeButton = await waitForVisibleXPath(
        "//tr[.//p[normalize-space()='BTC']]//button[normalize-space()='Trade']"
      );
      await btcTradeButton.click();
      await pauseForViewer();

      await waitForText('Trade BTC');
      const amountInput = await waitForVisibleXPath("//input[@type='number']");
      await amountInput.clear();
      await amountInput.sendKeys('10000');
      await pauseForViewer();

      await clickText('Open LONG Position');
      await pauseForViewer();
      await waitForText('Open Positions');

      const closePositionButton = await waitForVisibleXPath(
        "//div[.//h2[normalize-space()='Open Positions']]//button[not(normalize-space()='Close All')][1]"
      );
      await closePositionButton.click();
      await pauseForViewer();
      await waitForText('No open positions');
      await pauseForViewer();
    } catch (error) {
      await dumpPageSnapshot('walkthrough-failed');
      throw error;
    }
  });
});
