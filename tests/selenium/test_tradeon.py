import os
import unittest

from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def _build_base_url() -> str:
    return os.getenv("TRADEON_BASE_URL", "https://trade-on-phi.vercel.app").rstrip("/")


def _build_driver() -> webdriver.Chrome:
    options = ChromeOptions()
    if os.getenv("SELENIUM_HEADLESS", "1") != "0":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1600")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)


class TradeOnSeleniumTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_url = _build_base_url()
        cls.login_url = f"{cls.base_url}/login"
        cls.driver = _build_driver()
        cls.wait = WebDriverWait(cls.driver, 25)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def setUp(self):
        self._clear_browser_state()

    def _clear_browser_state(self):
        self.driver.get(self.login_url)
        self.driver.delete_all_cookies()
        self.driver.execute_script("localStorage.clear(); sessionStorage.clear();")

    def _open(self, url: str):
        self.driver.get(url)

    def _wait_for(self, by, selector, timeout=25):
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((by, selector))
        )

    def _wait_for_text(self, text: str, timeout=25):
        xpath = f"//*[contains(normalize-space(), {text!r})]"
        return self._wait_for(By.XPATH, xpath, timeout=timeout)

    def _click_text(self, text: str, timeout=25):
        xpath = f"//*[self::button or self::a][normalize-space()={text!r}]"
        element = self._wait_for(By.XPATH, xpath, timeout=timeout)
        element.click()
        return element

    def _accept_confirm(self):
        alert = self.wait.until(EC.alert_is_present())
        alert.accept()

    def _seed_demo_user(self):
        self.driver.execute_script(
            """
            localStorage.setItem('demo-user', JSON.stringify({
              name: 'Demo Trader',
              email: 'demo@trade-on.game',
              image: null
            }));
            """
        )

    def _go_to_game_as_demo_user(self):
        self._open(self.login_url)
        self._seed_demo_user()
        self._click_text("Play Now (Demo Mode)")
        self._wait_for_text("Start New Game")

    def test_login_page_shows_primary_actions(self):
        self._open(self.login_url)

        self._wait_for_text("Play Now (Demo Mode)")
        self._wait_for_text("Continue with Google")
        self._wait_for_text("A simulation game • No real money involved")

    def test_root_redirects_to_login_without_demo_session(self):
        self._open(self.base_url)

        self.wait.until(EC.url_contains("/login"))
        self._wait_for_text("Play Now (Demo Mode)")

    def test_demo_mode_routes_into_player_menu(self):
        self._open(self.login_url)
        self._seed_demo_user()

        self._click_text("Play Now (Demo Mode)")

        self._wait_for_text("Start New Game")
        self._wait_for_text("Saved Games")
        self._wait_for_text("Recent Games")
        self._wait_for_text("Leaderboard")

    def test_player_menu_sections_render_after_demo_entry(self):
        self._go_to_game_as_demo_user()

        self._wait_for_text("Your Stats")
        self._wait_for_text("Saved Games")
        self._wait_for_text("Recent Games")
        self._wait_for_text("Leaderboard")
        self._wait_for_text("No saved games yet")

    def test_start_new_game_opens_main_game_view(self):
        self._go_to_game_as_demo_user()

        self._click_text("Start New Game")

        self._wait_for_text("Market Overview")
        self._wait_for_text("Open Positions")
        self._wait_for_text("Quick Actions")
        self._wait_for_text("Select a coin to start trading")

    def test_selecting_btc_updates_trade_panel(self):
        self._go_to_game_as_demo_user()
        self._click_text("Start New Game")

        btc_trade_button = self._wait_for(
            By.XPATH,
            "//tr[.//td[.//p[normalize-space()='BTC']]]//button[normalize-space()='Trade']",
        )
        btc_trade_button.click()

        self._wait_for_text("Trade BTC")
        self._wait_for_text("$50,000.00")
        self._wait_for_text("Liquidation at")

    def test_open_long_position_creates_open_position_card(self):
        self._go_to_game_as_demo_user()
        self._click_text("Start New Game")

        btc_trade_button = self._wait_for(
            By.XPATH,
            "//tr[.//td[.//p[normalize-space()='BTC']]]//button[normalize-space()='Trade']",
        )
        btc_trade_button.click()

        amount_input = self._wait_for(By.CSS_SELECTOR, "input[type='number']")
        amount_input.clear()
        amount_input.send_keys("10000")

        self._click_text("Open LONG Position")

        self._wait_for_text("Open Positions")
        self._wait_for(
            By.XPATH,
            "//div[.//h2[normalize-space()='Open Positions']]//*[normalize-space()='BTC']",
        )
        self._wait_for(
            By.XPATH,
            "//p[normalize-space()='Turns Left']/following-sibling::p[normalize-space()='159']",
        )

    def test_header_save_shows_local_save_notification_for_demo_user(self):
        self._go_to_game_as_demo_user()
        self._click_text("Start New Game")

        self._click_text("Save")

        self._wait_for_text("Game state saved locally!")

    def test_game_menu_quit_returns_to_player_menu(self):
        self._go_to_game_as_demo_user()
        self._click_text("Start New Game")

        menu_button = self._wait_for(By.CSS_SELECTOR, "button[title='Game Menu']")
        menu_button.click()
        self._wait_for_text("Game Menu")

        self._click_text("Quit to Title")
        self._accept_confirm()

        self._wait_for_text("Start New Game")
        self._wait_for_text("Leaderboard")

    def test_header_sign_out_redirects_to_login(self):
        self._go_to_game_as_demo_user()
        self._click_text("Start New Game")

        self._click_text("Sign Out")
        self._accept_confirm()

        self.wait.until(EC.url_contains("/login"))
        self._wait_for_text("Play Now (Demo Mode)")


if __name__ == "__main__":
    unittest.main(verbosity=2)
