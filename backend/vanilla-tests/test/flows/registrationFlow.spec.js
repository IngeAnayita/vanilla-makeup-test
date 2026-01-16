const { expect } = require('chai');
const { until } = require('selenium-webdriver');
const RegisterPage = require('../pages/RegisterPage');
const LoginPage = require('../pages/LoginPage');
const { generateTestUser } = require('../fixtures/testUsers');

describe('Flujo Completo de Registro', function() {
    this.timeout(60000); // 60 segundos para cada test
    let registerPage, loginPage;
    let testUser;

    before(async () => {
        registerPage = new RegisterPage();
        loginPage = new LoginPage();
        testUser = generateTestUser();
    });

    it('debería registrar un nuevo usuario y redirigir a login', async () => {
        await registerPage.navigateTo('/register.html');
        await registerPage.completeRegistrationForm(testUser);
        await registerPage.submitRegistration();
        
        // Verificar redirección a login
        await registerPage.driver.wait(until.urlContains('login.html'), 10000);
        const currentUrl = await registerPage.driver.getCurrentUrl();
        expect(currentUrl).to.match(/login\.html$/);
    });

    it('debería iniciar sesión exitosamente', async () => {
        await loginPage.navigateTo('/login.html');
        await loginPage.login(testUser.email, testUser.password);
        
        // Verificar redirección a perfil sin comprobar datos
        await loginPage.driver.wait(until.urlContains('profile.html'), 15000);
        const currentUrl = await loginPage.driver.getCurrentUrl();
        expect(currentUrl).to.match(/profile\.html$/);
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            const currentUrl = await registerPage.driver.getCurrentUrl();
            console.log('URL actual al fallar:', currentUrl);
            await registerPage.takeScreenshot(this.currentTest.title);
        }
    });
});