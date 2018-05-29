require('babel-register')()

// Get Selenium and the drivers
var seleniumServer = require('selenium-server');
var chromedriver = require('chromedriver');
var geckodriver = require('geckodriver');

//path to app to test : change paths to your apps .app / .apk
var simuIosAppPath = './TestApp/app/Build/Products/Debug-iphonesimulator/EasyLifeConnect.app';
var realIosAppPath = './TestApp/app/Build/Products/Debug-iphoneos/EasyLifeConnect.app';
var simuAndroidAppPath = './TestApp/app/build/outputs/apk/debug/app-debug.apk'


var config = {
  src_folders: [
    // Folders with tests
    'tests'
  ],
  output_folder: 'reports', // Where to output the test reports
  page_objects_path : "pages",
  globals_path: "globals.js",

  custom_assertions_path: [
    "./node_modules/testarmada-nightwatch-extra/lib/assertions",
    "./node_modules/testarmada-nightwatch-extra/lib/assertions/mobile"
  ],
  custom_commands_path: [
    "./node_modules/testarmada-nightwatch-extra/lib/commands",
    "./node_modules/testarmada-nightwatch-extra/lib/commands/mobile"//,
  ],

  test_workers: {
    // This allows more then one browser to be opened and tested in at once
    enabled: true,
    workers: 'auto'
  },

  test_settings: {
    default: {

      selenium: {
        // Information for selenium, such as the location of the drivers ect.
        start_process: true,
        server_path: seleniumServer.path,
        port: 4444, // Standard selenium port
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path,
          'webdriver.gecko.driver': geckodriver.path
        }
      },
      screenshots: {
        enabled: false
      },
      globals: {
        // How long to wait (in milliseconds) before the test times out
        waitForConditionTimeout: 5000
      }
    },
    // Here, we give each of the browsers we want to test in, and their driver configuration
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true
      }
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true
      }
    },

    iosSim: {

      "selenium_port" : 4723,
      "desiredCapabilities": {
        "app": simuIosAppPath,
        "appiumVersion": "1.8.1",
        "automationName": "xcuitest",
        "platformName": "iOS",
        "platformVersion": "11.3",
        "deviceName": "iPhone 6",
        "sendKeyStrategy": "setValue",
        "showXcodeLog" : true

      },
      selenium: {
        "start_process": false
      },
      appium : {
        "start_process": true,
        "fullReset": false
      }
    },

    iosDevice: {

      "selenium_port" : 4723,
      "desiredCapabilities": {
        "app": realIosAppPath,
        "appiumVersion": "1.8.1",
        "automationName": "xcuitest",
        "platformName": "iOS",
        "sendKeyStrategy": "setValue",
        "showXcodeLog" : true,
        "platformVersion": "10.3.3",
        "deviceName": "iPhone",
        "udid": "YOUR UDID",
        "bundleId" : "YOUR BUNDLE ID"
       },
      selenium: {
        "start_process": false
      },
      appium : {
        "start_process": true,
        "fullReset": false
      }
    },

    androidSim: {

      "selenium_port" : 4723,
      "desiredCapabilities": {
        "app": simuAndroidAppPath,
        "appiumVersion": "1.8.1",
        "automationName": "UiAutomator2",
        "platformName": "Android",
        "platformVersion": "8.1.0",
        "deviceName": "Nexus_5X_API_27_x86",
        "avd": "Nexus_5X_API_27_x86",
        "avdArgs": "-netfast -noaudio -no-boot-anim",
        "autoGrantPermissions": true,
        "autoAcceptAlerts": true
      },
      selenium: {
        "start_process": false
      },
      appium : {
        "start_process": true,
        "fullReset": false
      }
    },

    androidDevice: {

      "selenium_port" : 4723,
      "automationName": "XCUITest",
      "desiredCapabilities": {
        "app": simuAndroidAppPath,
        "appiumVersion": "1.8.1",
        "automationName": "UiAutomator2",
        "platformName": "Android",
        "platformVersion": "6.0",
        "deviceName": "SAMSUNG GTI9100",
        "udid": "[YOUR UDID]",
        "autoGrantPermissions": true,
        "autoAcceptAlerts": true
      },
      selenium: {
        "start_process": false
      },
      appium : {
        "start_process": true,
        "fullReset": false
      }
    }

  }
};

module.exports = config;

