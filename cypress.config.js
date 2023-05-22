const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '3x2mhg',
  video: false,
  "chromeWebSecurity": false,
  "browser": "chrome",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl : 'test.com',
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
  
})
