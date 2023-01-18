import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  fixturesFolder: 'src/test/cypress/fixtures',
  screenshotsFolder: 'target/cypress/screenshots',
  chromeWebSecurity: true,
  viewportWidth: 1200,
  viewportHeight: 720,
  retries: 3,
  projectId: 'b46954',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/test/cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:1234/',
    specPattern: 'src/test/cypress/integration/**/*.spec.ts',
    supportFile: 'src/test/cypress/support/index.ts'
  }
})
