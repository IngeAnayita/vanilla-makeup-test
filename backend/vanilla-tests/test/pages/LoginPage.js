const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class LoginPage extends BasePage {
    constructor() {
        super();
        this.locators = {
            emailInput: By.id('email'),
            passwordInput: By.id('password'),
            loginButton: By.id('login-btn'),
            errorMessage: By.css('.error-message')
        };
    }

    async login(email, password) {
        await this.typeText(this.locators.emailInput, email);
        await this.typeText(this.locators.passwordInput, password);
        await this.clickElement(this.locators.loginButton);
    }
}

module.exports = LoginPage;