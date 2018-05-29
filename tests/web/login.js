//REPLACE [MON SITE] ,[AUTH PAGE TITLE] , [HOME PAGE TITLE] and input forms id and values
module.exports = {

    "En tant qu\'utilisateur je veux me connecter": function(browser) {
      // Browser is the browser that is being controlled

      browser
        .url('https://[MON SITE]') 
        .waitForElementVisible('body', 2000) 
        .verify.title('[AUTH PAGE TITLE]') 

        .setValue('input[name=username]', 'nd@toto.com')
        .setValue('input[name=password]', 'test')
        .submitForm('form#form-login')

        .pause(2000)
        .verify.title('[HOME PAGE TITLE]')  

        .end(); // This must be called to close the browser at the end
      },

      "En tant qu\'utilisateur je veux me connecter (version Pages)": function(browser) {
        // Browser is the browser that is being controlled
        const loginPage = browser.page.loginPage();
        const instancesPage = browser.page.instancesPage();

        loginPage
          .navigate();

        browser.waitForElementVisible('body', 2000);

        instancesPage.expect.element('@loginTitle').text.contain('[AUTH PAGE TITLE]');

        loginPage
          .login("nd@toto.com", "test");

        browser.pause(2000);

        instancesPage.expect.element('@homeTitle').text.to.contain('[HOME PAGE TITLE]') ; 
  
        browser.end(); // This must be called to close the browser at the end
      }

  }