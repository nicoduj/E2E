//REPLACE accessibility ids and values
module.exports = {

    "En tant qu\'utilisateur je veux me connecter": function(client) {

      client
        .setMobileElValue("accessibility id", "usernameField", "nd@toto.com")
        .setMobileElValue("accessibility id", "passwordField", "test")
        .clickMobileEl("accessibility id", "loginButton")

    }
  }
