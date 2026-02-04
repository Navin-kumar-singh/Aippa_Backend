const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
var nodemailer = require("nodemailer");
const logg = require("../utils/utils");
const axios = require("axios");
const { validateEmail } = require("./emailValidator");
const { DBMODELS } = require("../database/models/init-models");

const BrevoToken = process.env.Brevo_API_Token;
const transportOptions = {
  host: process.env.AWS_SES_ENDPOINT,
  port: process.env.AWS_SES_PORT || 465,
  secure: process.env.AWS_SES_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.AWS_SES_USERNAME,
    pass: process.env.AWS_SES_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// for mailgun

// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailgun.org', // Mailgun SMTP host
//   port: 587, // Mailgun SMTP port
//   auth: {
//     user: 'postmaster@mg.yuvamanthan.org', // Replace with your Mailgun SMTP user
//     pass: '60d82665be65b23c76b0f1faa66870b4-a2dd40a3-2c380ffc' // Replace with your Mailgun SMTP password
//   }
// });
// for aws
var transport = nodemailer.createTransport(transportOptions);
// for mailgun
// var transport = nodemailer.createTransport(transporter);


// const nodemailer = require('nodemailer');
//============== Stop  mailgun email provide service ============== \\
// let transporter = nodemailer.createTransport({
//   host: 'smtp.eu.mailgun.org',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: 'postmaster@mg.yuvamanthan.org',
//     pass: '60d82665be65b23c76b0f1faa66870b4-a2dd40a3-2c380ffc',
//   },
// });
//============== Stop  mailgun email provide service ============== \\


// let mailOptions = {
//   from: '"yuvamanthan" <connect@yuvamanthan.org>', // sender address
//   to: 'sahilgagan227@gmail.com', // list of receivers
//   subject: 'Hello', // Subject line
//   text: 'Hello world?', // plain text body
//   html: '<b>Hello world?</b>', // html body
// };

// var transport = nodemailer.createTransport(transporter);

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error occurred:', error.message);
//     return process.exit(1);
//   }
//   console.log('Message sent: %s', info.messageId);

//   // If needed, you can log the response from Mailgun
//   console.log('Server Response: %s', info.response);
// });






function BrevoEmailService(toEmail, subject, htmlContent, fromEmail) {
  const emailData = {
    sender: {
      name: 'G20 India',
      email: fromEmail || 'modelg20@yuvamanthan.com',
      company: 'Yuvamanthan'
    },
    to: [
      {
        email: toEmail
      }
    ],
    subject: subject,
    htmlContent: htmlContent
  };

  // Make the API call to Brevo
  axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
    headers: {
      'accept': 'application/json',
      'api-key': BrevoToken,
      'content-type': 'application/json'
    }
  })
    .then(response => {
      logg.success(response?.data);
    })
    .catch(error => {
      logg.error({ message: 'Error sending email:', details: error.response.data });
    });
}
let sendEmailService = async (toemail, subject, body, fromemail) => {
  try {
    console.log('email sent' + toemail);
    // const valid = await validateEmail(toemail, subject);
      var mailOptions = {
        // from: `"Yuvamanthan" <${fromemail || "connect@yuvamanthan.org"}>`,
  from: '"yuvamanthan" <connect@yuvamanthan.org>', // sender address

        to: toemail,
        envelope: {
          // from: `"Yuvamanthan" <${fromemail || "connect@yuvamanthan.org"}>`,
  from: '"yuvamanthan" <connect@yuvamanthan.org>', // sender address
          
          to: `${toemail}`,
        },
        subject: subject,
        html: body,
      };
      // transport.sendMail(mailOptions, function (error, info) {
      //   // console.log("hey this is console")
      //   console.log('mailoption', mailOptions)
      //   // console.log('info', info)
      //   if (error) {
      //     logg.error(error);
      //     DBMODELS.email_deliveries.create({ email: toemail, subject, status: "error", details: JSON.stringify(error) })
      //   } else {
      //     DBMODELS.email_deliveries.create({ email: toemail, subject, status: "sent", details: JSON.stringify(info) })
      //     logg.success(info.response);
      //   }
      // });
      transport.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error occurred:', error.message);
    return process.exit(1);
  }
  console.log('Message sent: %s', info.messageId);

  // If needed, you can log the response from Mailgun
  console.log('Server Response: %s', info.response);
});
  } catch (error) {
    logg.error(error)
  }
};
const sendTemplatedEmail = (
  emailConfig,
  replacements,
  emailtemplate,
  fromemail
) => {
  let TemplateFile;
  switch (emailtemplate) {
    case 1: // Certificate Email Template
      TemplateFile = "./NewTemplates/Certificate.html";
      break;
    case 2: // OTP Email Template
      TemplateFile = "./NewTemplates/OTPVarification.html";
      break;
    case 3: // Teacher Coordinator Email Template
      TemplateFile = "./NewTemplates/teacherCoordinator1.html";
      break;
    case 4: // Student Credentials Email Template
      TemplateFile = "./template/studentCredentials.html";
      break;
    case 5: // Activation Email Template
      TemplateFile = "./NewTemplates/AccountActivation.html";
      break;
    case 6: // Student Coordinator Email Template
      TemplateFile = "./NewTemplates/studentCoordinator1.html";
      break;
    case 7: // Bulk Affiliate Email Template
      TemplateFile = "./NewTemplates/BulkAffiliates.html";
      break;
    case 8: // Bulk Students Email Template
      TemplateFile = "./NewTemplates/BulkStudents.html";
      break;
    case 9: // Reset Password Email Template
      TemplateFile = "./NewTemplates/ResetPassword.html";
      break;
    case 10: // Welcome Email Template
      TemplateFile = "./NewTemplates/WelcomeStudent.html";
      break;
    case 11: //Welcome Institute bulk register
      TemplateFile = "./NewTemplates/bulkInstituteWelcome.html";
      break;
    case 12: //Welcome Institute bulk register
      TemplateFile = "./NewTemplates/bulkStudentWelcome.html";
      break;
    case 13: //Welcome Institute bulk register
      TemplateFile = "./NewTemplates/instituteWelcomEmail.html";
      break;
    case 14: //Welcome Institute bulk register
      TemplateFile = "./NewTemplates/newInstituteWelcome.html";
      break;
    case 15: //welcome Admin Register institute
      TemplateFile = "./NewTemplates/AdminInstituteWelcome.html";
      break;
    case "RESET_PASSWORD": //Reset Password Email
      TemplateFile = "./template/version2/RESET_PASSWORD.html";
      break;
    case "VERIFICATION_EMAIL": //Email Verification
      TemplateFile = "./template/version2/VERIFICATION_EMAIL.html";
      break;
    case "STUDENT_REGISTRATION": //Email for STUDENT_REGISTRATION
      TemplateFile = "./template/version2/STUDENT_REGISTRATION.html";
      break;
    case "SLOTS_MANAGEMENT": //Email for SLOTS_MANAGEMENT
      TemplateFile = "./template/version2/SLOTS_MANAGEMENT.html";
      break;
    case "Mun_cord_invitation": //Email for Mun_cord_invitation
      TemplateFile = "./template/version2/Mun_cord_invitation.html";
      break;
   case "MUN_COORD_APPOINT": //Email  for MUN_COORD_APPOINT
      TemplateFile = "./template/version2/MUN_COORD_APPOINT.html";
      break;
   case "Institute_Welcome": //Email  for Institute_Welcome
      TemplateFile = "./template/version2/Institute_Welcome.html";
      break;
      case "Nipam_Welcome": //Email  for Nipam_Welcome
      TemplateFile = "./template/version2/Nipam_Welcome.html";
      break;
      case "Institute_Acc_manager": //Email  for Institute_Acc_manager
      TemplateFile = "./template/version2/Institute_Acc_manager.html";
      break;
   case "Institute_Activate": //Email  for Institute_Activate
      TemplateFile = "./template/version2/Institute_Activate.html";
      break;
   case "Student_Activate": //Email  for Student_Activate
      TemplateFile = "./template/version2/Student_Activate.html";
      
      break;
    case "DISCUSSION_LINK": //Email for discussion link
      TemplateFile = "./template/version2/DISCUSSION_LINK.html";
      break;
      case "Applicant_reject": //Email for Applicant_reject
      TemplateFile = "./template/version2/Applicant_reject.html";
      break;
      case "PASSWORD_RESET_VERIFY_LINK": //Email for discussion link
      TemplateFile = "./template/version2/PASSWORD_RESET_VERIFY_LINK.html";
      break;
      
    case "COURSE_REMINDER": //Email Verification
      TemplateFile = "./NewTemplates/courseNotCompleteReminder.html";
      break;
      case "Riasec_result": //Riasec_result
      TemplateFile = "./template/version2/Riasec_result.html";
      break;

      case "Email_Subscription": //Email Verification
      TemplateFile = "./template/version2/Email_Subscription.html";
      break;

      case "Nipam_Circular":  
      TemplateFile = "./NewTemplates/NipamCircular.html";
      break;

      
  }
  // SEND Email Service
  const filePath = path.join(__dirname, TemplateFile);
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const htmlToSend = template(replacements);
  sendEmailService(
    emailConfig.email,
    emailConfig.subject,
    htmlToSend,
    fromemail
  );
  // End Email Sending Service
};

module.exports = sendEmailService;
module.exports.sendTemplatedEmail = sendTemplatedEmail;
