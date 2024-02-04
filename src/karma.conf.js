process.env.CHROME_BIN = require('puppeteer').executablePath() // IMPORTANT!

module.exports = function (config) {
  config.set({

    customLaunchers: {
        ChromeHeadless: {
          base: 'Chrome',
          flags: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--remote-debugging-port=9222'
          ]
        }
      },

    frameworks: ["mocha", "chai"],
    files: ["test/**/*.js"],
    reporters: ["progress", "coverage-istanbul"],
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
  });
};
