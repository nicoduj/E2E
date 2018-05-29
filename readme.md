
# Objectif

L'objectif  de ce document est de lister les étapes nécessaires pour  pouvoir écrire des scénarii de tests (tests end to end - E2E), éxécuté en environnement utilisateur (browser / app mobile), et intégrable dans une chaine d'IC. 

Nous utiliserons nightwatch.js comme framework. Il fait appel à W3C WebDriver API (anciennement Sélénium).

Nous verrons également comment le combiner à appium afin de réaliser, sur la même architecture, des tests d'application Mobile Native (ou Web).


# Installation de l'environnement

Les informations ci-après sont issues de l'installation sur sur MAC.
L'ensemble est isntallé dans le contexte d'un projet, et non pas en global .

## Pré-requis


* Node.js : https://nodejs.org/en/download/
* Java JRE / JDK  : http://www.oracle.com/technetwork/java/javase/downloads/index.html


Vous devez également vous assurer que vos variables d'environnements sont bonnes, sinon les ajouter  : 

```bash
export JAVA_HOME="/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home"
export PATH=$JAVA_HOME/bin:$PATH

export ANDROID_HOME=/Users/nd/Library/Android/sdk/
export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Pré-requis mobiles 

Pour la partie mobile, il faut également :
* Avoir XCode installé (et les simulateurs)
* Avoir Android Studio installé (et les émulateurs)

Afin de vérifier que tout est ok pour appium, il est bon d'installer l'extension appium-doctor (en global ici pour simplifier) : https://github.com/appium/appium-doctor  :

```bash
npm install appium-doctor -g
appium-doctor
```

Si tout est ok, vous devez avoir une sortie du type : 

```
MACBOOKAIR-NICO:feazy-tests nd$ appium-doctor
info AppiumDoctor Appium Doctor v.1.4.3
info AppiumDoctor ### Diagnostic starting ###
info AppiumDoctor  ✔ The Node.js binary was found at: /usr/local/bin/node
info AppiumDoctor  ✔ Node version is 9.11.1
info AppiumDoctor  ✔ Xcode is installed at: /Applications/Xcode.app/Contents/Developer
info AppiumDoctor  ✔ Xcode Command Line Tools are installed.
info AppiumDoctor  ✔ DevToolsSecurity is enabled.
info AppiumDoctor  ✔ The Authorization DB is set up properly.
info AppiumDoctor  ✔ Carthage was found at: /usr/local/bin/carthage
info AppiumDoctor  ✔ HOME is set to: /Users/nd
info AppiumDoctor  ✔ ANDROID_HOME is set to: /Users/nd/Library/Android/sdk/
info AppiumDoctor  ✔ JAVA_HOME is set to: /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
info AppiumDoctor  ✔ adb exists at: /Users/nd/Library/Android/sdk/platform-tools/adb
info AppiumDoctor  ✔ android exists at: /Users/nd/Library/Android/sdk/tools/android
info AppiumDoctor  ✔ emulator exists at: /Users/nd/Library/Android/sdk/tools/emulator
info AppiumDoctor  ✔ Bin directory of $JAVA_HOME is set
info AppiumDoctor ### Diagnostic completed, no fix needed. ###
info AppiumDoctor
info AppiumDoctor Everything looks good, bye!
info AppiumDoctor
```

## Les packages

Le fichier package.json exemple : 

```json
{
  "name": "E2E",
  "version": "1.0.0",
  "description": "tests E2E",
  "main": "",
  "author": "Nicolas Dujardin",
  "license": "ISC",
  "scripts": {
  },
  "dependencies": {
  },
  "devDependencies": {
    "chromedriver": "^2.38.3",
    "geckodriver": "^1.11.0",
    "nightwatch": "^0.9.21",
    "selenium-server": "^3.12.0",
    "testarmada-nightwatch-extra": "^5.1.0",
    "appium": "^1.8.1"
  }
}
```

## Initialisation d'un projet 

Avec ce fichier, il vous suffit donc de créer votre projet node.js, puis d'installer les packages npm : 

```bash
npm -init
npm -install
```

# Configuration des tests

## NightWatch

Afin de configurer NightWatch, il suffit de créer un fichier *nightwatch.conf.js*

```javascript

// Get Selenium and the drivers
var seleniumServer = require('selenium-server');
var chromedriver = require('chromedriver');
var geckodriver = require('geckodriver');

var config = {
  src_folders: [
    // Folders with tests
    'tests'
  ],
  output_folder: 'reports', // Where to output the test reports
	
  custom_assertions_path: [
    "./node_modules/testarmada-nightwatch-extra/lib/assertions"
  ],
  custom_commands_path: [
    "./node_modules/testarmada-nightwatch-extra/lib/commands"
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
    }
  }
};

module.exports = config;
```


On retrouve dans ce fichier les différentes configuration pour les différents navigateurs (safari, chrome, firefox). Ces navigateurs doivent bien entendu être installés sur la machine de test.

Les répertoires tests / reports doivent exister, et le premier contiendra vos tests sous la forme de fichiers js.

## Appium

Afin de lancer / arrêter automatiquement appium pour les tests sur mobile, il faut créer un fichier *globals.js* : 

```javascript
const appium = require("./node_modules/testarmada-nightwatch-extra/lib/plugins/appium");

module.exports = {
  before: function (callback) {
    appium.before(this) .then(callback())},

  after: function (callback) {
    appium.after(this).then( callback())}
};
```

Puis le référencer dans la conf de nightwatch, ainsi que les commandes liées aux mobiles  :

```javascript
var config = {
	...
  globals_path: "globals.js",
	
	  custom_assertions_path: [
   ...
    "./node_modules/testarmada-nightwatch-extra/lib/assertions/mobile"
  ],
  custom_commands_path: [
    ...
    "./node_modules/testarmada-nightwatch-extra/lib/commands/mobile"
  ],
	
	...
```


# Lancement de tests

Dans votre fichier package.json, ajouter les scripts pour lancer les tests

```json

{
	...
	
  "scripts": {
    "nightwatch_chrome": "nightwatch -c nightwatch.conf.js -e chrome --group web",
    "nightwatch_firefox": "nightwatch -c nightwatch.conf.js -e firefox --group web",
    "nightwatch_safari": "nightwatch -c nightwatch.conf.js -e safari --group web",
    "nightwatch_iosSim": "nightwatch -c nightwatch.conf.js -e iosSim --group mobile/ios",
    "nightwatch_iosDevice": "nightwatch -c nightwatch.conf.js -e iosDevice --group mobile/ios",
    "nightwatch_androidSim": "nightwatch -c nightwatch.conf.js -e androidSim --group mobile/android",
    "nightwatch_androidDevice": "nightwatch -c nightwatch.conf.js -e androidDevice --group mobile/android"
  },
	
	...
	
```

Dans l'ordre : 
* -c [fichier de conf de nightwatch]
* -e [environnement de test, nom dans le fichier de conf de nightwatch]
* --group [nom du sous répertoire sous votre répertoire de test, pour limiter éventuellement / ordonner. Il est facultatif ]

Pour lancer une séquence de test, il faut alors faire, par exemple  : 

``` bash
npm run nightwatch_chrome
```

# Un test Web

Créez un fichier "login.js" dans votre répertoire tests, de cette forme : 

module.exports = {

``` javascript
    'En tant qu\'utilisaetur  je veux me connecter': function(browser) {
      // Browser is the browser that is being controlled

      browser
        .url('https://feazy.coaxys.com') 
        .waitForElementVisible('body', 2000) 
        .verify.title('Authentification | Feazy') 

        .setValue('input[name=username]', 'nicolas.dujardin@coaxys.com')
        .setValue('input[name=password]', 'toto')
        .submitForm('form#form-login')

        .pause(2000)
        .verify.title('Vue d\'ensemble | Feazy')  

        .end() // This must be called to close the browser at the end
      }

  }
``` 

Le code est plutôt explicite de lui même : 
* on accède à l'URL du site
* on attend que la page soit affichée
* on vérifie que l'on est sur la bonne page
* on met les informations dans le champ du formulaire
* on submit la form
* on vérifie que l'on est bien sur la home du site

En sortie, vous devriez obtenir :

``` bash
 tests/web/login   [INFO] [Nightwatch Extra] Found nightwatch configuration at /Users/nd/Documents/Coaxys/TEST/feazy-tests/nightwatch.conf.js
 tests/web/login   \n
 tests/web/login   [Web / Login] Test Suite
============================
 tests/web/login
 tests/web/login   Results for:  En tant qu'administrateur global je veux ajouter une structure
 tests/web/login   ✔ Element <body> was visible after 58 milliseconds.
 tests/web/login   ✔ Testing if the page title equals "Authentification | Feazy".
 tests/web/login   ✔ Testing if the page title equals "Vue d'ensemble | Feazy".
 tests/web/login   OK. 3 assertions passed. (6.35s)

  >> tests/web/login finished.
``` 

# Et sur mobile ?

## Ajout des sections de conf à votre fichier nightwatch

### IOS - simulateur

``` javascript
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
``` 


### IOS - Real Device

``` javascript
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
        "udid": "f9138410fe1003d220f63a914d1a455931a7f155",
        "bundleId" : "com.coaxys.EasyLifeConnect"
       },
      selenium: {
        "start_process": false
      },
      appium : {
        "start_process": true,
        "fullReset": false
      }
    }
``` 
	
### Android - simulateur

```javascript
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
    }
``` 
### Android - Real Device

``` javascript 
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
        "udid": "W3D7N16C02034234",
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
``` 

## Un test

Les test doivent être écrits avec de scommandes dédiées au mobiles . Cf  https://github.com/TestArmada/nightwatch-extra/blob/master/docs/ios.md et https://github.com/TestArmada/nightwatch-extra/blob/master/docs/android.md pour la liste des commandes

A ce stade, les test Andoid / IOS ne peuvenêtret  mutualisés du fait de mécanique d'accès différent aux contrôles.

Il est possible d'utiliser des requêtes Xpath, mais là encore les paths seraient différents.

### IOS

Sous IOS, on va chercher les composants par leur accessibility id. Il convient que ces denriers aient été séttés sous Xcode.

```javascript
module.exports = {

    "En tant qu\'utilisateur je veux me connecter": function(client) {

      client
        .setMobileElValue("accessibility id", "usernameField", "nd@toto.com")
        .setMobileElValue("accessibility id", "passwordField", "test")
        .clickMobileEl("accessibility id", "loginButton")

    }
  }
``` 

### Android

Sous Android, on va chercher les composants par leur id. 

```javascript
module.exports = {

    "En tant qu\'utilisateur je veux me connecter": function(client) {

      client
        .setMobileElValue("id", "email", "nd@toto.com")
        .setMobileElValue("id", "password", "test")
        .clickMobileEl("id", "email_sign_in_button")

    }
  }
``` 

## Points de vigilance

D'un façon générale, sous Simulateur, i lfaut lancer le simulateur avant de lancer les tests, sinon on aura bien souvent un timeout.

Pour IOS, sur realDevice, il faut s'assurer que le projet suivant build, en mettant à jour els identités de signature pour qu'ils pouissent se déployer sur le mobileê (qui doit tre associé au compte DEV) : *node_modules/appium/node_modules/appium-xcuitest-driver/WebDriverAgent/WebDriverAgent.xcodeproj*

Pour ios, il est aussi vivement conseillé d'activer les logs xcode (showXcodeLog in nightwatch.conf.js)

Enfin, Il faut bien vérfiier que els informatiosn de modèle et d'UID sont cohérentes, y compris les noms des simulateurs et leurs version d'OS.

# Repo Exemple 

Feazy sert de "cobaye" a cette démarche. Le repo :

```bash
git clone git@bitbucket.org:coaxys/feazy-tests.git
```

# Ressources

Tutorial principal qui a servi de base : 
* https://www.codementor.io/johnkennedy/e2e-testing-with-nightwatch-part-one-b44jzd6mv
* https://www.codementor.io/johnkennedy/e2e-testing-with-nightwatch-part-two-b57uwf375
* https://www.codementor.io/johnkennedy/e2e-testing-with-nightwatch-part-three-bzpnspxfn

Principaux sites de référence :
* http://appium.io
* http://nightwatchjs.org
* https://github.com/TestArmada/nightwatch-extra
* www.google.com (qui est et sera toujours ton ami)

