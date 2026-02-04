/*
Registrations functionalities
-send OTP functionality
-resend OTP functionality
-Institute Registration Functionality
-Institue OTP Verification functionality
-Student Registration Functionality
-Student OTP Verification functionality

 */
const { uid } = require("uid");
const jwt = require("jsonwebtoken");

const {
  InstitutionRegisterSchema,
  registerSchema,
  AffiliateInstitutionRegisterSchema,
} = require("../auth/validation");
const sendEmailService = require("../../service/email");
const { sendTemplatedEmail } = require("../../service/email");
const { hashingPassword } = require("../auth/validation");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");
const { Op } = require("sequelize");
const newSlugify = require("../../middleware/newSlugify");

// --------------Institute----------------
//new institute register code
async function instituteRegisterController(req, res) {
  if (req) {
    try {
      // validation of data
      let validated = InstitutionRegisterSchema.validate(req.body);
      if (validated.error) {
        res
          .status(403)
          .json({ status: "error", message: validated.error.message });
      } else {
        // Account Check Success
        const checkCoord = await DBMODELS.institute_coordinators.findOne({
          where: {
            [Op.or]: [
              { email: validated.value.email },
              { contact: validated.value.contact },
            ],
          },
        });
        const checkInstitute = await DBMODELS.institutions.findOne({
          where: {
            [Op.or]: [
              { email: validated.value.email },
              { contact: validated.value.contact },
            ],
          },
        });
        const checkStudent = await DBMODELS.students.findOne({
          where: {
            [Op.or]: [
              { email: validated.value.email },
              { contact: validated.value.contact },
            ],
          },
        });
        if (!checkCoord && !checkInstitute && !checkStudent) {
          let encrypt_pass = await hashingPassword(validated.value.password);
          const sqlvalues = {
            title: validated.value.title,
            first_name: validated.value.first_name,
            last_name: validated.value.last_name,
            institution_name: validated.value.institute_name,
            institution_address: validated.value.institute_address,
            state: validated.value.state,
            district: validated.value.district,
            pincode: validated.value.pincode,
            email: validated.value.email,
            status: "pending",
            password: encrypt_pass,
            contact: validated.value.contact,
            slug: newSlugify(validated.value.institute_name),
            club: validated.value.club,
          };
          const saveInstitute = await DBMODELS.institutions.create(sqlvalues);
          // sending Email
          if (saveInstitute) {
            // OTP Verification implemented here
            let user = {
              name:
                validated?.value?.first_name +
                " " +
                validated?.value?.last_name,
              email: validated?.value?.email,
              type: "institute",
            };
            const sendVerifyEmail = sendEmailVerificationLink(user);
            return res.json({
              status: "success",
              email: "Account Registered Successfully",
            });
          }
          //End Sending Email
        } else {
          return res.json({
            status: "warning",
            message: "Account with this email or contact number already exist",
          });
        }
      }
    } catch (err) {
      logg.error(err);
      res.json({
        status: "ERROR",
        message: "Error while registering you please try again later",
      });
    }
  } else {
    res.json({ status: "ERROR", message: "Captcha verification is required" });
  }
}
// ---------------Start Students-------------
async function studentRegisterController(req, res) {
  const { userType } = req.query;
  let role;
  switch (userType) {
    case "teacher":
      role = "teacher";
      break;
    default:
      role = "student";
      break;
  }
  const permission = req.body?.permission;
  delete req.body?.permission;
  const validation = registerSchema.validate(req.body);
  //IF Validation Error
  if (validation?.error) {
    return res.json({
      status: "ERROR",
      message: validation.error.message,
    });
  } else {
    //Passes Validation
    // Account Check Success
    const checkCoord = await DBMODELS.institute_coordinators.findOne({
      where: {
        [Op.or]: [
          { email: validation.value.email },
          { contact: validation.value.contact },
        ],
      },
    });
    const checkInstitute = await DBMODELS.institutions.findOne({
      where: {
        [Op.or]: [
          { email: validation.value.email },
          { contact: validation.value.contact },
        ],
      },
    });
    const checkStudent = await DBMODELS.students.findOne({
      where: {
        [Op.or]: [
          { email: validation.value.email },
          { contact: validation.value.contact },
        ],
      },
    });
    //NOT EXISTS
    if (!checkCoord && !checkInstitute && !checkStudent) {
      const encryptedPassword = await hashingPassword(
        validation.value.password
      );
      const insertStudent = await DBMODELS.students.create({
        first_name: validation.value.first_name,
        last_name: validation.value.last_name,
        father_name: validation.value.father_name,
        instituteId: validation.value.instituteId,
        email: validation.value.email,
        contact: validation.value.contact,
        status: "pending",
        password: encryptedPassword,
        dob: validation.value.dob,
        gender: validation.value.gender,
        role,
        permission,
      });
      if (insertStudent) {
        let user = {
          name:
            validation?.value?.first_name + " " + validation?.value?.last_name,
          email: validation?.value?.email,
          type: "student",
        };
        const sendVerifyEmail = sendEmailVerificationLink(user);
        return res.json({
          status: "success",
          message: "Registered Successfully",
        });
      }
    } else {
      //EXISTS
      return res.json({ status: "warning", message: "Account Already Exists" });
    }
  }
}

/* Functionality :- institutionAffiliationPost function register a new institute from affiliated institute*/
async function instituteAffiliateController(req, res) {
  logg.success(req.query.affiliate_id);
  try {
    const validated = AffiliateInstitutionRegisterSchema.validate(req.body);
    //validation of data
    if (validated.error) {
      res
        .status(403)
        .json({ status: "ERROR", message: validated.error.message });
    } else {
      // Validation Success
      //Check for previous email

      const result = await DBMODELS.institutions.findAll({
        attributes: ["email"],
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });

      const checkCoord = await DBMODELS.institute_coordinators.findOne({
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });

      const checkStudent = await DBMODELS.students.findOne({
        where: {
          [Op.or]: [
            { email: validated.value.email },
            { contact: validated.value.contact },
          ],
        },
      });
      if (
        result?.length !== 0 ||
        checkCoord?.length !== 0 ||
        checkStudent.length !== 0
      ) {
        return res.status(409).json({
          status: "ERROR",
          message: "Registration with same email address already exist",
        });
      } else {
        //Check for previous Contact
        const result2 = await DBMODELS.institutions.findAll({
          attributes: ["contact"],
          where: {
            contact: validated.value.contact,
          },
        });

        let password = "@Yuva" + uid(4);
        if (result2.length !== 0) {
          return res.status(409).json({
            status: "ERROR",
            message: "Registration with same contact number already exist",
          });
        } else {
          // OTP Verification will be implemented here
          let hashPassword = await hashingPassword(password);
          //Save
          const sqlvalues = {
            title: validated.value.title,
            first_name: validated.value.first_name,
            middle_name: validated.value.middle_name,
            last_name: validated.value.last_name,
            institution_name: validated.value.institute_name,
            institution_address: validated.value.institute_address,
            state: validated.value.state,
            pincode: validated.value.pincode,
            email: validated.value.email,
            contact: validated.value.contact,
            slug: newSlugify(validated.value.institute_name),
            status: "active",
            password: hashPassword,
            affiliate_id: req.query.affiliate_id,
          };
          const result3 = await DBMODELS.institutions.create(sqlvalues);
          if (result3) {
            async function welcomeEmail() {
              const institute_count = await DBMODELS.institutions.count();

              let mailConfig = {
                email: validated.value.email,
                subject: "Welcome to G20YM",
              };
              let replacements = {
                name:
                  validated.value.first_name + " " + validated.value.last_name,
                institute: validated.value.institute_name,
                username: validated.value.email,
                password: password,
                institute: validated.value.institute_name,
                institute_count: institute_count + 1846,
              };

              sendTemplatedEmail(mailConfig, replacements, 11);
            }
            welcomeEmail();

            // function credentailsEmail() {
            //   const replacements = {
            //     name: validated.value.first_name + " " + validated.value.last_name,
            //     username: validated.value.email,
            //     password: password,

            //   };

            //   let mailConfig = {
            //     email: validated.value.email,
            //     subject: "Congratulations! Your Yuvamanthan account has been activated!",
            //   };
            //   sendTemplatedEmail(mailConfig, replacements, 5);
            // }
            // credentailsEmail();
            return res.status(200).json({
              status: "SUCCESS",
              message: `Thank you for your interest in organising Yuvamanthan Model G20 in your institution.We at Yuvamanthan are glad to have ${validated.value.institute_name} onboard with us. Please check your email for further details`,
            });
          }
        }
      }
    }
  } catch (err) {
    logg.error(err);
  }
}
// Email Verification Function And API
async function sendEmailVerificationLink(user) {
  try {
    const { email, type, name } = user;
    if (email && type && name) {
      const verify_token = jwt.sign(
        { email, type, name },
        process.env.JWT_SECRET,
        { expiresIn: "20m" }
      );
      // Send email to user with link to reset password
      const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/account-verify/${verify_token}`;
      // Send Email
      const replacements = {
        name,
        verificationUrl,
      };
      let mailConfig = {
        email,
        subject: "Please verify your email ID for your Yuvamanthan account.",
      };
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "VERIFICATION_EMAIL"
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logg.error(error);
    return false;
  }
}
module.exports = {
  sendEmailVerificationLink,
  instituteAffiliateController,
  instituteRegisterController,
  studentRegisterController,
  // instituteVerification,
  // studentVerification,
  // resentOtp,
  // sendEmailOTP4: sentOtp,
};