const assert = require('node:assert/strict');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = (process.env.TRADEON_BASE_URL || 'https://trade-on-phi.vercel.app').replace(/\/$/, '');
const LOGIN_URL = `${BASE_URL}/login`;
const DEFAULT_TIMEOUT = 25000;

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
  const options = new chrome.Options();
  if (process.env.SELENIUM_HEADLESS !== '0') {
    options.addArguments('--headless=new');
  }
  options.addArguments('--window-size=1440,1600');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
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

async function waitForUrlContains(fragment, timeout = DEFAULT_TIMEOUT) {
  await driver.wait(async () => (await driver.getCurrentUrl()).includes(fragment), timeout);
}

async function clearBrowserState() {
  await driver.get(LOGIN_URL);
  await driver.manage().deleteAllCookies();
  await driver.executeScript('localStorage.clear(); sessionStorage.clear();');
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

async function seedGameState(overrides = {}) {
  const seed = {
    player: { balance: 500000, portfolio: {} },
    coins: DEFAULT_COINS,
    positions: [],
    turnsRemaining: 0,
    marketInsiderAttempts: 3,
    isGameOver: true,
    isGameStarted: true,
    ...overrides,
  };

  await driver.executeScript(
    `localStorage.setItem('trade-on-game', JSON.stringify(${JSON.stringify({
      state: seed,
      version: 0,
    })}));`
  );
}

async function goToDemoPlayerMenu() {
  await clearBrowserState();
  await seedDemoUser();
  await clickText('Play Now (Demo Mode)');
  await waitForText('Start New Game');
}

async function openGameView() {
  await goToDemoPlayerMenu();
  await clickText('Start New Game');
  await waitForText('Market Overview');
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

  beforeEach(async () => {
    await clearBrowserState();
  });

  it('login page shows primary actions', async () => {
    await driver.get(LOGIN_URL);

    await waitForText('Play Now (Demo Mode)');
    await waitForText('Continue with Google');
    await waitForText('A simulation game • No real money involved');
  });

  it('root redirects to login without demo session', async () => {
    await driver.get(BASE_URL);

    await waitForUrlContains('/login');
    await waitForText('Play Now (Demo Mode)');
  });

  it('demo mode routes into the player menu', async () => {
    await driver.get(LOGIN_URL);
    await seedDemoUser();

    await clickText('Play Now (Demo Mode)');

    await waitForText('Start New Game');
    await waitForText('Saved Games');
    await waitForText('Recent Games');
    await waitForText('Leaderboard');
  });

  it('player menu renders stats, saves, history, and leaderboard sections', async () => {
    await goToDemoPlayerMenu();

    await waitForText('Your Stats');
    await waitForText('Saved Games');
    await waitForText('Recent Games');
    await waitForText('Leaderboard');
    await waitForText('No saved games yet');
  });

  it('start new game opens the active game view', async () => {
    await openGameView();

    await waitForText('Open Positions');
    await waitForText('Quick Actions');
    await waitForText('Select a coin to start trading');
  });

  it('selecting BTC updates the trade panel', async () => {
    await openGameView();

    const btcTradeButton = await waitForVisibleXPath(
      "//tr[.//p[normalize-space()='BTC']]//button[normalize-space()='Trade']"
    );
    await btcTradeButton.click();

    await waitForText('Trade BTC');
    await waitForText('$50,000.00');
    await waitForText('Liquidation at');
  });

  it('open long position creates an open position card and advances the turn', async () => {
    await openGameView();

    const btcTradeButton = await waitForVisibleXPath(
      "//tr[.//p[normalize-space()='BTC']]//button[normalize-space()='Trade']"
    );
    await btcTradeButton.click();

    const amountInput = await waitForVisibleXPath("//input[@type='number']");
    await amountInput.clear();
    await amountInput.sendKeys('10000');

    await clickText('Open LONG Position');

    await waitForText('Open Positions');
    await waitForVisibleXPath("//div[.//h2[normalize-space()='Open Positions']]//*[normalize-space()='BTC']");
    await waitForVisibleXPath("//p[normalize-space()='Turns Left']/following-sibling::p[normalize-space()='159']");
  });

  it('open short position creates a short position card', async () => {
    await openGameView();

    const btcTradeButton = await waitForVisibleXPath(
      "//tr[.//p[normalize-space()='BTC']]//button[normalize-space()='Trade']"
    );
    await btcTradeButton.click();

    await clickText('Short');

    const amountInput = await waitForVisibleXPath("//input[@type='number']");
    await amountInput.clear();
    await amountInput.sendKeys('10000');

    await clickText('Open SHORT Position');

    await waitForText('Open Positions');
    await waitForVisibleXPath("//div[.//h2[normalize-space()='Open Positions']]//*[normalize-space()='SHORT']");
    await waitForVisibleXPath("//p[normalize-space()='Turns Left']/following-sibling::p[normalize-space()='159']");
  });

  it('skip turn decreases turns remaining by one', async () => {
    await openGameView();

    await clickText('Skip Turn');

    await waitForVisibleXPath("//p[normalize-space()='Turns Left']/following-sibling::p[normalize-space()='159']");
  });

  it('skip day decreases turns remaining by eight', async () => {
    await openGameView();

    await clickText('Skip Day (8 Turns)');

    await waitForVisibleXPath("//p[normalize-space()='Turns Left']/following-sibling::p[normalize-space()='152']");
  });

  it('header save shows local-save notification for demo users', async () => {
    await openGameView();

    await clickText('Save');

    await waitForText('Game state saved locally!');
  });

  it('game menu quit returns to the player menu', async () => {
    await openGameView();

    const menuButton = await waitForVisibleXPath("//button[@title='Game Menu']");
    await menuButton.click();
    await waitForText('Game Menu');

    await clickText('Quit to Title');

    const alert = await driver.switchTo().alert();
    await alert.accept();

    await waitForText('Start New Game');
    await waitForText('Leaderboard');
  });

  it('header sign out redirects to login', async () => {
    await openGameView();

    await clickText('Sign Out');

    const alert = await driver.switchTo().alert();
    await alert.accept();

    await waitForUrlContains('/login');
    await waitForText('Play Now (Demo Mode)');
  });

  it('seeded game-over state shows the modal and back to menu resets to the player menu', async () => {
    await driver.get(LOGIN_URL);
    await seedDemoUser();
    await seedGameState({
      player: { balance: 500000, portfolio: {} },
      positions: [],
      turnsRemaining: 0,
      marketInsiderAttempts: 0,
      isGameOver: true,
      isGameStarted: true,
    });

    await driver.get(BASE_URL);

    await waitForText('Game Over');
    await waitForText('Final Balance');

    await clickText('Back to Menu');

    await waitForText('Start New Game');
    await waitForText('Leaderboard');
  });

  it('seeded game-over state can be restarted with Play Again', async () => {
    await driver.get(LOGIN_URL);
    await seedDemoUser();
    await seedGameState({
      player: { balance: 500000, portfolio: {} },
      positions: [],
      turnsRemaining: 0,
      marketInsiderAttempts: 0,
      isGameOver: true,
      isGameStarted: true,
    });

    await driver.get(BASE_URL);

    await waitForText('Game Over');
    await clickText('Play Again');

    await waitForText('Market Overview');
    await waitForText('Quick Actions');
  });
});
