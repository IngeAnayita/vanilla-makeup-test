module.exports = {
  generateTestUser: () => {
      const randomString = Math.random().toString(36).substring(2, 6);
      return {
          name: `Usuario ${randomString}`,
          email: `test${randomString}@correo.com`,
          password: '12345',
          skinType: 'mixta',
          occupation: `Tester ${randomString}`,
          exposureLevel: 'sol'
      };
  }
};