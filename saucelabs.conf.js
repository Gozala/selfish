module.exports = function(config) {
  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '40'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '35'
    },
    sl_opera: {
      base: 'SauceLabs',
      browserName: 'opera',
      version: '11'
    },
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.0'
    },
    sl_osx_safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'selfish.js',
      'tests/browser.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['dots', 'sauceLabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    sauceLabs: {
      testName: 'Web App Unit Tests',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      }
    },
    // Increase timeout in case connection in CI is slow
    captureTimeout: 180000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    // Continuous Integration mode
    singleRun: true
  });
};
