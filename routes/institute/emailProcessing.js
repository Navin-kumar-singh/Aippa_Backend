/*
   ======= Student / Institute Bulk Register Email Processing =====
   - update Student for the Email 
   - Send Welcome / Credentials  Email 
 */
const multer = require("multer");
const { uid } = require("uid");
const fs = require("fs");
const xlsx = require("xlsx");
const { sendTemplatedEmail } = require("../../service/email");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const { hashingPassword } = require("../auth/validation");
const sequelize = require("../../database/connection");
const JWT = require("jsonwebtoken");
const { emailDelegates } = require("./delegatesEmail");
const { eventDeadlinesChecker } = require("./instituteEvent");
var resetFalg = true;

async function emailProcessing(data, type) {
  const dataSaved = [];
  // const data = req.json;
  try {
    if (type == "STUDENT") {
      data?.map((list) => {
        dataSaved.push({
          name: list.first_name + " " + list.last_name,
          email: list.email,
          password: list.password,
          instituteId: list.instituteId,
          type,
        });
      });
    } else if (type == "INSTITUTE") {
      data?.map((list) => {
        dataSaved.push({
          name: list.first_name + " " + list.last_name,
          email: list.email,
          password: list.password,
          institution_name: list.institution_name,
          affiliate_id: list.affiliate_id,
          type,
        });
      });
    }
  } catch (error) {
    logg.error(error);
  }

  DBMODELS.emailProcessing
    .bulkCreate(dataSaved, {
      fields: [
        "name",
        "email",
        "password",
        "type",
        "instituteId",
        "institution_name",
        "affiliate_id",
      ],
      validate: true,
    })
    .then((result) => {
      if (result.length) {
        resetFalg = true;
      }
    })
    .catch((error) => {
      logg.error(error);
    });
}
module.exports = { emailProcessing };

//Continues Email Sending Process
setInterval(() => {
  if (resetFalg) {
    var emails = [];
    DBMODELS.emailProcessing
      .findAll({ raw: true, order: ["createdAt"] })
      .then((result) => {
        if (result.length) {
          emails = Array.from(result).slice(0, 25);
          instituteEmails = emails.filter((list) => {
            return list.type === "INSTITUTE";
          });
          studentEmails = emails.filter((list) => {
            return list.type === "STUDENT";
          });
          emailWelcomeInstitute(studentEmails);
          // emailLoginCredentials(studentEmails);
          emailWelcomeInstitutes(instituteEmails);
          // emailLoginCredential(instituteEmails);
          emails.forEach((list) => {
            DBMODELS.emailProcessing.destroy({
              where: {
                id: list.id,
              },
            });
          });
        } else {
          resetFalg = false;
        }
      });
  }
}, 60000);

function emailWelcomeInstitute(student) {
  try {
    student.forEach(async ({ email, name, password, instituteId }) => {
      const institute_name = await DBMODELS.institutions.findAll({
        where: {
          id: instituteId,
        },
        attributes: ["institution_name"],
      });
      let mailConfig = {
        email: email,
        subject: "Welcome to G20YM",
      };

      let replacements = {
        name: name,
        username: email,
        password: password,
        institute_name: institute_name[0].dataValues.institution_name,
      };
      sendTemplatedEmail(
        mailConfig,
        replacements,
        12,
        "modelg20@yuvamanthan.com"
      );
    });
  } catch (err) {
    throw err;
  }
}

// function emailLoginCredentials(students) {
//   try {
//     students.forEach(({ email, name, password }) => {
//       let emailConfig = {
//         email: email,
//         subject: "Login credentials for G20YM",
//       };
//       let replacements = {
//         name: name,
//         username: email,
//         password: password,
//       };
//       sendTemplatedEmail(emailConfig, replacements, 4);
//     });
//   } catch (err) {
//     throw err;
//   }
// }

async function emailWelcomeInstitutes(institutes) {
  const institute_count = await DBMODELS.institutions.count();
  institutes.forEach(
    async ({ email, name, password, institution_name, affiliate_id }) => {
      const AffiliateInstituteId = await DBMODELS.institute_affiliate.findAll({
        where: {
          id: affiliate_id,
        },
        attributes: ["instituteId"],
      });

      const institutesWithInstituteId = await DBMODELS.institutions.findAll({
        where: {
          id: AffiliateInstituteId[0].dataValues.instituteId,
        },
        attributes: ["institution_name"],
      });
      let mailConfig = {
        email: email,
        subject: "Welcome to G20YM",
      };
      let replacements = {
        parent_institute:
          institutesWithInstituteId[0].dataValues.institution_name,
        name: name,
        username: email,
        password: password,
        institute: institution_name,
        institute_count: institute_count + 1846,
      };

      sendTemplatedEmail(
        mailConfig,
        replacements,
        11,
        "modelg20@yuvamanthan.com"
      );
    }
  );
}
