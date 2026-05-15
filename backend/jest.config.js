module.exports = {
  testEnvironment: 'node',
  // setupFilesAfterEnv corre una vez por archivo de test, después de que Jest
  // haya cargado su framework, dejando beforeAll/afterAll/afterEach disponibles.
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testTimeout: 60000,
  forceExit: true,
};
