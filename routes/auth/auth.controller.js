const {mysqlcon} = require("../../model/db");
var generator = require("generate-password");
const sendEmailService = require("../../service/email");
const {createJWT} = require("./jwt");
const jwt = require("jsonwebtoken");
const {
  hashingPassword,
  loginSchema,
  checkHashedPass,
} = require("./validation");
const logg = require("../../utils/utils");
const {DBMODELS} = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const {QueryTypes} = require("sequelize");
const { sendEmailVerificationLink } = require("../register/register.controller");
const {default: axios} = require("axios");

async function loginController(req, res) {
  const {identifier, password} = req.body;
  const {type} = req.query;
  let proceeder = true;
  if (identifier && password) {
    const validation = await loginSchema.validate(req.body);
    //validation error
    if (validation.error) {
      return res.status(200).json({
        status: "warning",
        message: validation.error.message,
      });
    } else {
      //validation is ok
      // Login For Institute
      if (proceeder) {
        let result = await sequelize.query(
          `SELECT ins.id,ins.first_name,ins.last_name,ins.password,ins.status,ins.logo,ins.institution_name,ins.email,ins.institution_address,ion.id AS onboard_check
          FROM institutions as ins
          LEFT JOIN institute_onboard as ion
          ON ion.instituteId=ins.id WHERE ins.email='${validation.value.identifier}'`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (result && result?.length !== 0) {
          proceeder = false;
          result = result[0];
          const {
            id,
            institution_name,
            logo,
            email,
            institution_address,
          } = result;
          switch (result?.status) {
            case "active":
            case "pending":
              let confirmedPass = await checkHashedPass(
                validation.value.password,
                result.password
              );
              // Wrong Password
              if (!confirmedPass) {
                return res.json({
                  status: "warning",
                  message: "Incorrect Login or Password",
                });
              }
              // Correct Password
              else {
                let user = {
                  id,
                  logo,
                  institution_name,
                  email,
                  institution_address,
                  type: 1,
                  role: "institute",
                };
                return res.json({
                  status: "success",
                  message: "Logged in successfully",
                  user,
                  jwt: await createJWT({
                    id,
                    role: "institute",
                    type: 1,
                    institution_name,
                    email,
                    institution_address,
                  }),
                });
              }
              break;
            case "inactive":
              return res.json({
                status: "warning",
                message:
                
                  "Account is inactivate contact with yuvamanthan team for more info email: connect@yuvamanthan.org",
                description:
                  "Yuvamanthan team will contact with you soon to guide you further to your account login",
              });
            default:
              return res.json({
                status: "warning",
                message:
                  "Account is not Authorised to login for help you can email us connect@yuvamanthan.org",
              });
          }
        }
      }
      if (proceeder){
        //Login For Students
        let result = await sequelize.query(
          `SELECT stud.role,stud.id,stud.password,stud.status,stud.profile,stud.instituteId,stud.email,ston.id AS onboard_check
          FROM students as stud
          LEFT JOIN student_onboard as ston
          ON ston.studentId=stud.id WHERE stud.email='${validation.value.identifier}'`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (result && result?.length !== 0) {
          proceeder = false;
          result = result[0];
          const {
            id,
            first_name,
            last_name,
            profile,
            status,
            email,
            instituteId,
            role,
            onboard_check,
          } = result;
          switch (result?.status) {
            case "active":
            case "pending":
              let confirmedPass = await checkHashedPass(
                validation.value.password,
                result.password
              );
              // Wrong Password
              if (!confirmedPass) {
                return res.json({
                  status: "warning",
                  message: "Incorrect Login or Password",
                });
              } else {
                let user = {
                  id,
                  first_name,
                  last_name,
                  status,
                  profile,
                  instituteId,
                  email,
                  role,
                  type: 0,
                };
                return res.json({
                  status: "success",
                  message: "Logged in successfully",
                  user,
                  jwt: await createJWT({
                    id,
                    type: 0,
                    role,
                    instituteId,
                    email,
                  }),
                });
              }
            case "inactive":
              return res.json({
                status: "warning",
                message:
                  "Account is inactivate contact with yuvamanthan team for more info email: connect@yuvamanthan.org",
                description:
                  "Yuvamanthan team will contact with you soon to guide you further to your account login",
              });
            default:
              return res.json({
                status: "warning",
                message:
                  "Account is not Authorised to login for help you can email us connect@yuvamanthan.org",
              });
          }
        }
      }
      if (proceeder){
        //Login For Admins
        const result = await DBMODELS.admin.findOne({
          where: {
            email: validation.value.identifier,
          },
        });
        if (result) {
          proceeder = false;
          switch (result.status) {
            case "active":
              let confirmedPass = await checkHashedPass(
                validation.value.password,
                result.password
              );
              if (!confirmedPass) {
                return res.json({message: "Invalid Login Credential"});
              } else {
                const {id, first_name, email, role, profile} = result;
                return res.json({
                  status: "success",
                  message: "Logged in successfully",
                  user: {id, first_name, email, role, profile, type: 2},
                  jwt: await createJWT({
                    id,
                    type: 2,
                    first_name,
                    email,
                    role,
                  }),
                });
              }
              break;
            case "inactive":
              return res.json({
                status: "warning",
                message:
                  "Account is inactivate contact with yuvamanthan team for more info email: connect@yuvamanthan.org",
                description:
                  "Yuvamanthan team will contact with you soon to guide you further to your account login",
              });
            default:
              return res.json({
                status: "warning",
                message:
                  "Account is not Authorised to login for help you can email us connect@yuvamanthan.org",
              });
          }
        }
      }
      if (proceeder) {
        // Coordinator Login
        let result = await sequelize.query(
          `
        SELECT ins.id,ins.first_name,ins.last_name,inco.password,ins.status,ins.logo,ins.institution_name,ins.email,ins.institution_address
        FROM institutions as ins
        INNER JOIN institute_coordinators as inco
        ON inco.instituteId=ins.id
        WHERE inco.email='${validation.value.identifier}' LIMIT 1`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (result && result?.length !== 0) {
          proceeder = false;
          result = result[0];
          const {
            id,
            institution_name,
            first_name,
            last_name,
            logo,
            email,
            institution_address,
          } = result;
          switch (result?.status) {
            case "active":
            case "pending":
              let confirmedPass = await checkHashedPass(
                validation.value.password,
                result.password
              );
              // Wrong Password
              if (!confirmedPass) {
                return res.json({
                  status: "warning",
                  message: "Incorrect Login or Password",
                });
              } else {
                // Correct Password
                let user = {
                  id,
                  logo,
                  institution_name,
                  email,
                  institution_address,
                  type: 1,
                  role: "coordinator",
                };
                return res.json({
                  status: "success",
                  message: "Logged in successfully",
                  user,
                  jwt: await createJWT({
                    id,
                    type,
                    role: "coordinator",
                    institution_name,
                    email,
                    institution_address,
                  }),
                });
              }
            case "inactive":
              return res.json({
                status: "warning",
                message:
                  "Account is inactivate contact with yuvamanthan team for more info email: connect@yuvamanthan.org",
                description:
                  "Yuvamanthan team will contact with you soon to guide you further to your account login",
              });
            default:
              return res.json({
                status: "warning",
                message:
                  "Account is not Authorised to login for help you can email us connect@yuvamanthan.org",
              });
          }
        }
      }
      if (proceeder) {
        return res.json({
          status: "warning",
          message: "Account Not Exist!!",
        });
      }
    }
  } else {
    return res.json({status: "error", message: "Please Fill All Fields"});
  }
}
async function sendVerificationEmail(req, res) {
  try {
    const {email, type, name} = req?.body;
    console.log("Email API has been hit on frontend!!");
    if (email && type && name) {
      const user = {
        email,
        type,
        name,
      };
      const sendVerifyEmail = sendEmailVerificationLink(user);
      if (sendVerifyEmail) {
        return res.json({
          status: "success",
          message: "Verification Email Sent To Your Email Address.",
        });
      } else {
        return res.json({
          status: "error",
          message: "Email Address Not Found.",
        });
      }
    } else {
      return res.json({status: "error", message: "Email Address Not Found."});
    }
  } catch (error) {
    logg.error(error);
    return res.json({status: "error", message: "OOps Something Went Wrong"});
  }
}
async function verifyAccount(req, res) {
  try {
    const {token} = req?.query;
    if (!token) {
      return res.json({
        status: "invalid",
        message: "Invalid request, Please send new reset request again",
      });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {email, type, name} = decoded;
    // Find the user by userId in token
    switch (type) {
      case "student":
      case "teacher": {
        let student = await DBMODELS.students.findOne({
          where: {email},
          raw: true,
        });
        if (student?.status !== "active") {
          [updateAccount] = await DBMODELS.students.update(
            {status: "active"},
            {
              where: {email},
            }
          );
          if (updateAccount) {
            var replacements = {
              name,
            };
            var mailConfig = {
              email,
              subject: "Welcome to Yuvamanthan, thank you for your interest",
            };
            sendEmailService.sendTemplatedEmail(mailConfig, replacements, 10);
          }
        } else {
          return res.json({
            status: "warning",
            message: "Account already Verified.",
            decoded,
          });
        }
        break;
      }
      case "institute": {
        let institute = await DBMODELS.institutions.findOne({
          where: {email},
          raw: true,
        });
        if (institute?.status !== "active") {
          [updateAccount] = await DBMODELS.institutions.update(
            {status: "active"},
            {
              where: {email},
            }
          );
          if (updateAccount) {
            const {count} = await DBMODELS.institutions.findAndCountAll();
            var replacements = {
              username: name,
              institute_count: count,
              institution_name: email,
            };
            var mailConfig = {
              email,
              subject: "Welcome to Yuvamanthan, thank you for your interest",
            };
            sendEmailService.sendTemplatedEmail(mailConfig, replacements, 14);
          }
        } else {
          return res.json({
            status: "warning",
            message: "Account already Verified.",
            decoded,
          });
        }
        break;
      }
    }
    return res.json({
      status: "success",
      message: "Account Verified Successfully.",
      decoded,
    });
  } catch (error) {
    logg.error(error);
    res.json({
      status: "error",
      message:
        "Verification link is expired. Please resend a new verification link.",
    });
  }
}
async function forgotController(req, res) {
  const {type, email} = req.body;
  if (!type && !email) {
    res.status(404).json({message: "Please provide all details!"});
  } else if (type == 0 || type == 1) {
    const table =
      type == 0
        ? "students"
        : type == 1
          ? "institutions"
          : res.status(409).json({message: "Invalid User"});
    try {
      mysqlcon.query(
        `SELECT id, email FROM ${table} WHERE email='${email}'`,
        async (err, result) => {
          if (err) throw err;
          if (result[0]) {
            let clientPass = generator.generate({length: 12, numbers: true});
            let pass = await hashingPassword(clientPass);
            mysqlcon.query(
              `UPDATE ${table} SET password='${pass}' WHERE id=${result[0].id} AND email='${email}'`,
              function (err, updateResult) {
                if (err) {
                  logg.error(err);
                  return res
                    .status(500)
                    .json({message: "Internal Server Error"});
                }
                if (updateResult.affectedRows == 0) {
                  res
                    .status(404)
                    .json({message: "Sorry, You can't reset your password"});
                }
                const replacements = {
                  name: "sir / mam",
                  username: email,
                  password: clientPass,
                };
                let mailConfig = {
                  email: email,
                  subject:
                    "Congratulations! Your Yuvamanthan account password has been reset successfully!",
                };
                sendEmailService.sendTemplatedEmail(
                  mailConfig,
                  replacements,
                  9
                );
                //End Email Sending
                return res.status(200).json({
                  message:
                    "Reset Successful, Your Password sent to you on registered email",
                });
              }
            );
          } else {
            // res.status(400).json({ message: "Sorry, You can't reset your password" });
            try {
              const coordinatorTable =
                type == 0
                  ? "student_coordinators"
                  : type == 1
                    ? "institute_coordinators"
                    : res.status(409).json({message: "Invalid User"});
              mysqlcon.query(
                `SELECT id, email FROM ${coordinatorTable} WHERE email='${email}'`,
                async (err, result) => {
                  if (err) throw err;
                  if (result[0]) {
                    let clientPass = generator.generate({
                      length: 12,
                      numbers: true,
                    });
                    let pass = await hashingPassword(clientPass);
                    mysqlcon.query(
                      `UPDATE ${coordinatorTable} SET password='${pass}' WHERE id=${result[0].id} AND email='${email}'`,
                      function (err, updateResult) {
                        if (err) {
                          logg.error(err);
                          return res
                            .status(500)
                            .json({message: "Internal Server Error"});
                        }
                        if (updateResult.affectedRows == 0) {
                          res.status(404).json({
                            message: "Sorry, You can't reset your password",
                          });
                        }
                        const replacements = {
                          name: "sir / mam",
                          username: email,
                          password: clientPass,
                        };
                        let mailConfig = {
                          email: email,
                          subject:
                            "Congratulations! Your Yuvamanthan account password has been reset successfully!",
                        };
                        sendEmailService.sendTemplatedEmail(
                          mailConfig,
                          replacements,
                          9
                        );
                        //End Email Sending
                        return res.status(200).json({
                          message:
                            "Reset Successful, Your Password sent to you on registered email",
                        });
                      }
                    );
                  } else {
                    res.status(400).json({
                      message: "Sorry, You can't reset your password",
                    });
                  }
                }
              );
            } catch (error) {
              logg.error(error);
              res.json(500).json({message: "Internal Server Error"});
            }
          }
        }
      );
    } catch (error) {
      logg.error(error);
      res.json(500).json({message: "Internal Server Error"});
    }
  } else {
    res.status(404).json({message: "Invalid Request"});
  }
}
async function setpassword(req, res) {
  const {id, key} = req.query;
  const {email, password} = req.body;
  if (!id || !key || !email || !password) {
    return res.status(400).json({message: "Invalid Request try again Later"});
  }
  let pass = await hashingPassword(password);
  sql = `UPDATE institutions SET statuskey='generated',password='${pass}' WHERE id=${id} AND email='${email}'`;
  try {
    mysqlcon.query(sql, function (err, result) {
      if (err) throw err;
      res
        .status(200)
        .json({message: "Password Set Successfully", id, key, email, password});
    });
  } catch (error) {
    res.json(500).json({message: "Internal Server Error"});
  }

}
async function changePassword(req, res) {
  const {id} = req.query;
  const {password, newpassword, type, email} = req.body;
  if (!newpassword || !password || !type) {
    return res.json({
      status: "error",
      message: "Invalid Request try again Later",
    });
  }
  let pass = await hashingPassword(newpassword);
  if (Number(type) == 0) {
    mysqlcon.query(
      `SELECT password FROM students WHERE id=${id} AND email='${email}'`,
      async function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({message: "Internal Server Error"});
        }
        if (result.length == 0)
          return res.status(404).json({message: "User Not Found"});
        let confirmedPrevPass = await checkHashedPass(
          newpassword,
          result[0].password
        );
        if (confirmedPrevPass)
          return res
            .status(303)
            .json({message: "Passoword is same Previous"});
        let confirmedPass = await checkHashedPass(password, result[0].password);
        if (!confirmedPass)
          return res.status(403).json({message: "Wrong Password"});
        mysqlcon.query(
          (sql = `UPDATE students SET password='${pass}' WHERE id=${id} AND email='${email}'`),
          function (err, result) {
            if (err) {
              logg.error(err);
              return res.status(500).json({message: "Internal Server Error"});
            }
            if (result.affectedRows == 0) {
              res.status(404).json({message: "Invalid Request"});
            }
            return res
              .status(200)
              .json({message: "Password Changed Successfully"});
          }
        );
      }
    );
  } else if (Number(type) == 1) {
    mysqlcon.query(
      `SELECT password FROM institutions WHERE id=${id} AND email='${email}'`,
      async function (err, result) {
        if (err) {
          logg.error(err);
          return res.status(500).json({message: "Internal Server Error"});
        }
        if (result.length == 0)
          return res.status(404).json({message: "User Not Found"});
        let confirmedPrevPass = await checkHashedPass(
          newpassword,
          result[0].password
        );
        if (confirmedPrevPass)
          return res.status(303).json({message: "Password is same Previous"});
        let confirmedPass = await checkHashedPass(password, result[0].password);
        if (!confirmedPass)
          return res.status(403).json({message: "Wrong Password"});
        mysqlcon.query(
          (sql = `UPDATE institutions SET password='${pass}' WHERE id=${id} AND email='${email}'`),
          function (err, result) {
            if (err) {
              logg.error(err);
              return res.status(500).json({message: "Internal Server Error"});
            }
            if (result.affectedRows == 0) {
              res.status(404).json({message: "Invalid Request"});
            }
            return res
              .status(200)
              .json({message: "Password Changed Successfully"});
          }
        );
      }
    );
  } else {
    res.status(405).json({message: "Method is not allowed"});
  }
}

const captchaVerifyController = (req, res) => {
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY ?? "6Lc9y8snAAAAAMP8zRBrTrJnEiBTds6UrjikVfkq";
  const {recaptchavalue} = req.headers;
  console.log(secret)
  if (!recaptchavalue) {
    return res.json({status: "error", message: "Recaptcha value missing"});
  }
  axios
    .post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret: secret,
        response: recaptchavalue,
      },
    })
    .then((response) => {
      const {success, score} = response.data;
      const minScoreThreshold = 0.5;

      if (success && score >= minScoreThreshold) {
        return res.json({data: response.data});
      } else {
        return res.json({
          status: "error",
          message: "reCAPTCHA verification failed or score too low",
          data: response.data
        });
      }
    })
    .catch((err) => {
      console.error("reCAPTCHA verification error:", err,);
      return res.json({status: "error", message: "Verification failed"});
    });
}
module.exports = {
  sendVerificationEmail,
  verifyAccount,
  loginController,
  forgotController,
  setpassword,
  changePassword,
  captchaVerifyController
};