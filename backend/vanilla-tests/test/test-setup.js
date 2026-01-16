const { Builder, until, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Configuración de paths para Windows
process.env.PATH += `;${path.join('C:', 'selenium_drivers')}`;

let driver;

before(async function() {
  this.timeout(40000);

  try {
    const options = new chrome.Options()
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .windowSize({ width: 1920, height: 1080 });

    if (process.env.HEADLESS === 'true') {
      options.headless();
    }

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().setTimeouts({ 
      implicit: 10000,
      pageLoad: 30000,
      script: 30000
    });

  } catch (error) {
    console.error('🚨 Error al inicializar WebDriver:', error);
    throw error;
  }
});

after(async function() {
  if (driver) {
    await driver.quit().catch(e => console.error('Error al cerrar driver:', e));
  }
});

afterEach(async function() {
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync(`test/reports/${testName}_${timestamp}.png`, screenshot, 'base64');
    } catch (e) {
      console.error('Error al capturar screenshot:', e);
    }
  }
});

module.exports = { 
  getDriver: () => {
    if (!driver) throw new Error('Driver no inicializado');
    return driver;
  },
  baseUrl: 'http://localhost/SWI_Maquillaje/VIEW',
  elementWait: 15000
};