
const appium = require("./node_modules/testarmada-nightwatch-extra/lib/plugins/appium");

module.exports = {
  before: function (callback) {
    appium.before(this) .then(callback())},

  after: function (callback) {
    appium.after(this).then( callback())}
};
