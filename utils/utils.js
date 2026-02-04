/*
  Consol log with Highlighted Log Type.
  *( Single argument Log.)
 */

const chalk = require("chalk");
const success = chalk.bgGreenBright;
const info = chalk.blueBright.bgWhiteBright;
const warning = chalk.yellowBright.bgYellowBright;
const error = chalk.redBright.bgRedBright;
const bgwhite = chalk.bgWhiteBright;
const logg = {
  warning: function (text) {
    console.log(warning(" Warning "), text);
  },
  success: function (text) {
    console.log(success(" Success "), text);
  },
  info: function (text) {
    console.log(info(" Infomation "), text);
  },
  error: function (text) {
    console.log(error(" Error "), text);
  }, 
}; 

module.exports = logg;
