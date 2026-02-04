/* SMTP Mail sender middlewares */
var nodemailer = require("nodemailer");
const logg = require("../utils/utils");
var transport = nodemailer.createTransport({
  host: process.env.AWS_SES_ENDPOINT,
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.AWS_SES_USERNAME,
    pass: process.env.AWS_SES_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});
async function sendMail(toemail, subject, body, fromemail) {
  var mailOptions = {
    from: 'mohitdheer224@gmail.com',
    to: toemail,
    subject: subject,
    html: body,
  };
  let response = "response";
  sendReturn = false;
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      logg.error(error);
      response = error;
      sendReturn = true;
    } else {
      response = info.response;
      sendReturn = true;
    }
  });
  if (sendReturn) {
    return response;
  }
}
module.exports = sendMail;
