const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class ChatbotPage extends BasePage {
    constructor() {
        super();
        this.locators = {
            chatInput: By.id('chat-input'),
            sendButton: By.id('send-btn'),
            lastBotMessage: By.css('.bot-message:last-child .message-content'),
            loadingIndicator: By.id('loading-indicator')
        };
    }

    async askAboutTrends() {
        await this.typeText(this.locators.chatInput, 'tendencias 2025');
        await this.clickElement(this.locators.sendButton);
        await this.waitForLoadingComplete();
    }

    async getTrendsResponse() {
        return await this.getElementText(this.locators.lastBotMessage);
    }

    async waitForLoadingComplete() {
        await this.driver.wait(async () => {
            return !(await this.isElementVisible(this.locators.loadingIndicator));
        }, 10000);
    }
}

module.exports = ChatbotPage;