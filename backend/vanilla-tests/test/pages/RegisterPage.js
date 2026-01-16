const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class RegisterPage extends BasePage {
    constructor() {
        super();
        this.locators = {
            nameInput: By.id('name'),
            emailInput: By.id('email'),
            passwordInput: By.id('password'),
            skinTypeInput: By.id('skin_type'),
            occupationInput: By.id('occupation'),
            exposureInput: By.id('exposure_level'),
            registerButton: By.id('register-btn')
        };
    }

    async completeRegistrationForm(userData) {
        await this.typeText(this.locators.nameInput, userData.name);
        await this.typeText(this.locators.emailInput, userData.email);
        await this.typeText(this.locators.passwordInput, userData.password);
        await this.typeText(this.locators.skinTypeInput, userData.skinType);
        await this.typeText(this.locators.occupationInput, userData.occupation);
        await this.typeText(this.locators.exposureInput, userData.exposureLevel);
    }

    async submitRegistration() {
        await this.clickElement(this.locators.registerButton);
        
        // Manejo robusto del alert
        try {
            await this.driver.wait(until.alertIsPresent(), 5000);
            const alert = await this.driver.switchTo().alert();
            await alert.accept();
        } catch (error) {
            console.log('No se encontró alerta o ya se cerró automáticamente');
        }
    }
}

module.exports = RegisterPage;