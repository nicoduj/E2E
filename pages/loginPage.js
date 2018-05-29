const loginCommands = {  
    login(email, password) {
      return this
        .waitForElementVisible('body', 2000) 
        .setValue('@emailInput', email)
        .setValue('@passwordInput', password)
        .submitForm('@loginForm')
    }
  };
  
  export default {  
    url: 'https://toto.com',
    commands: [loginCommands],
    elements: {
      emailInput: {
        selector: 'input[name=username]'
      },
      passwordInput: {
        selector: 'input[name=password]'
      },
      loginForm: {
        selector: 'form#form-login'
      }
    }
  };