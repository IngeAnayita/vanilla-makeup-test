const { getDriver, baseUrl, elementWait } = require('../test-setup');
const { By, until } = require('selenium-webdriver');
const fs = require('fs');

class BasePage {
    constructor() {
        this.driver = getDriver();
        this.baseUrl = baseUrl;
    }

    async navigateTo(path) {
        const url = path.startsWith('http') ? path : `${this.baseUrl}/${path.replace(/^\//, '')}`;
        await this.driver.get(url);
        await this.driver.wait(until.urlContains(url.split('/').pop()), elementWait);
    }

    async typeText(locator, text) {
        const element = await this.waitForElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    async clickElement(locator) {
        const element = await this.waitForElement(locator);
        await this.driver.wait(until.elementIsEnabled(element), elementWait);
        await element.click();
    }

    async waitForElement(locator, timeout = elementWait) {
        return await this.driver.wait(
            until.elementLocated(locator),
            timeout,
            `Elemento no encontrado: ${locator.toString()}`
        );
    }

    async isElementVisible(locator) {
        try {
            const element = await this.waitForElement(locator);
            return await element.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async takeScreenshot(testName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshot = await this.driver.takeScreenshot();
        const dir = 'test/reports/screenshots';
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const filePath = `${dir}/${testName}_${timestamp}.png`;
        fs.writeFileSync(filePath, screenshot, 'base64');
        return filePath;
    }

    async getElementText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }
}

module.exports = BasePage;