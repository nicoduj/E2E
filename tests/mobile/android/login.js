//REPLACE  ids and values
module.exports = {

    "En tant qu\'utilisateur je veux me connecter": function(client) {

      client
        .setMobileElValue("id", "email", "nd@toto.com")
        .setMobileElValue("id", "password", "test")
        .clickMobileEl("id", "email_sign_in_button")

    }
  }