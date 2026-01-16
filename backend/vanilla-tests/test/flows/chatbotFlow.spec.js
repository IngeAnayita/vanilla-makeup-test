const { expect } = require('chai');
const ChatbotPage = require('../pages/ChatbotPage');

describe('Pruebas de Chatbot', function() {
    this.timeout(30000);
    let chatbotPage;

    before(async () => {
        chatbotPage = new ChatbotPage();
        await chatbotPage.navigateTo('/chatbot.html');
    });

    it('debería responder sobre tendencias 2025', async () => {
        await chatbotPage.askAboutTrends();
        const response = await chatbotPage.getTrendsResponse();
        
        expect(response).to.include('tendencias de maquillaje para 2025');
        expect(response).to.include('Skinimalism');
        expect(response).to.include('Colores terrosos');
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await chatbotPage.takeScreenshot(this.currentTest.title);
        }
    });
});