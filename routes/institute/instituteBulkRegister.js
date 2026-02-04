/*
  ============Institute Bulk Register Control ============= 
  - Update Bulk Registered Institute
  - update hash password
 */

const { uid } = require("uid");
const { DBMODELS } = require("../../database/models/init-models");
const { default: slugify } = require("slugify");
const { sendTemplatedEmail } = require("../../service/email");
const { hashingPassword } = require("../auth/validation");
const logg = require("../../utils/utils");
const { emailProcessing } = require("./emailProcessing");
const newSlugify = require("../../middleware/newSlugify");

const passwordToUpdate = [];


/* Functionality :- validate function validates the Institute Bulk register data, for bulk registering*/


async function validate(data, affiliate_id) {
  var emails = [];
  var dataSaved = [];
  var dataFailed = [];
  try {
    const instituteEmail = await DBMODELS.institutions.findAll({
      attributes: ["email"],
      raw: true,
    });
    const studentEmails = await DBMODELS.students.findAll({
      attributes: ["email"],
      raw: true,
    });
    const coordinaterEmail = await DBMODELS.institute_coordinators.findAll({
      attributes: ["email"],
      raw: true,
    });
    instituteEmail.forEach(({ email }) => {
      emails = [...emails, email];
    });
    studentEmails.forEach(({ email }) => {
      emails = [...emails, email];
    });
    coordinaterEmail.forEach(({ email }) => {
      emails = [...emails, email];
    });
    if (data) {
      await data.map(
        async ({
          first_name,
          last_name,
          email,
          contact_no,
          institution_name,
          institution_address,
          district,
          state,
          pincode,
        }) => {
          if (
            first_name &&
            last_name &&
            email &&
            contact_no &&
            institution_name &&
            institution_address &&
            district &&
            state &&
            pincode
          ) {
            if (emails.includes(email)) {
              dataFailed = [
                ...dataFailed,
                {
                  first_name,
                  last_name,
                  email,
                  contact_no,
                  institution_name,
                  institution_address,
                  state,
                  pincode,
                  Error: "User Exists ",
                },
              ];
            } else {
              dataSaved = [
                ...dataSaved,
                {
                  first_name: first_name,
                  last_name: last_name,
                  email: email,
                  contact: contact_no,
                  institution_name: institution_name,
                  affiliate_id: affiliate_id,
                  slug: newSlugify(institution_name),
                  institution_address: institution_address,
                  state: district + " " + state,
                  pincode: pincode,
                  status: "active",
                  password: "@Yuva" + uid(4),
                },
              ];
            }
          } else {
            dataFailed = [
              ...dataFailed,
              {
                first_name,
                last_name,
                email,
                contact_no,
                institution_name,
                affiliate_id,
                institution_address,
                state,
                pincode,
                Error: "User Data Missing",
              },
            ];
          }
        }
      );
    }
    return { dataSaved, dataFailed };
  } catch (err) {
    logg.error(err);
  }
}


/* Functionality :- this setInterval is taking passwords from passwordToUpdate array in sequence the sending to updatePassword for encryption*/


setInterval(() => {
  if (passwordToUpdate.length) {
    pass = passwordToUpdate.pop();
    updatePassword(pass);
  }
}, 20);



/* Functionality :- updatePassword is encrypting the passwords */

async function updatePassword(institute) {
  try {
    await DBMODELS.institutions.update(
      {
        password: await hashingPassword(institute.password),
      },
      {
        where: { id: institute.id },
      }
    );
  } catch (error) {
    logg.error(error);
  }
}

/* Functionality :- instituteBulkRegister function register the institutes in bulk and we are using it in Insititute's affiliate tab*/



async function instituteBulkRegister(req, res) {
  const { affiliate_id } = req.query;
  const data = req.json;
  if (data?.length <= 1000 && data?.length > 0) {
    await validate(data, affiliate_id)
      .then(async ({ dataSaved, dataFailed }) => {
        if (dataSaved || dataFailed) {
          try {
            const result = await DBMODELS.institutions.bulkCreate(dataSaved, {
              fields: [
                "first_name",
                "last_name",
                "email",
                "contact",
                "institution_name",
                "affiliate_id",
                "slug",
                "institution_address",
                "status",
                "district",
                "state",
                "pincode",
                "password",
              ],
              validate: true,
            });
            res
              .status(200)
              .json({
                message: "Data Uploaded Successfuly.",
                dataSaved: result,
                dataFailed,
              });
            try {
              let temp = Array.from(result);
              passwordToUpdate.push(...temp);
              emailProcessing(result, "INSTITUTE");
            } catch (err) {
              logg.error(err);
            }
          } catch (err) {
            res
              .status(404)
              .json({ message: "Data Uploaded Failed!!", err, dataFailed });
          }
        }
      })
      .catch((err) => {
        res.status(201).json({
          message: "Data Format Incorrect!!",
        });
      });
  } else if (data.length === 0) {
    res.status(201).json({ message: "No Data Found" });
  } else if (data.length > "'a") {
    res.status(201).json({ message: "Excedd Data Limit" });
  } else {
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}
module.exports = { instituteBulkRegister };
