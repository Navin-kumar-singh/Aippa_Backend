// Remove this block from your controller file (lines 280-298):
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  middle_name: Joi.string().allow('', null),
  last_name: Joi.string().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dob: Joi.string().pattern(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in DD/MM/YYYY or DD-MM-YYYY format'
    }),
  father_name: Joi.string().required(),
  email: Joi.string().email().required(),
  contact: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(10).required(),
  clas: Joi.alternatives().try(
    Joi.string(),
    Joi.number()
  ).required(),
  instituteId: Joi.alternatives().try(
    Joi.string().pattern(/^\d+$/),
    Joi.number().integer()
  ).optional().allow(null, '')
});

const loginSchema = Joi.object({
  identifier: Joi.required(),
  password: Joi.string().min(10).required(),
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  desc: Joi.string().required(),
  stock: Joi.number().required(),
});

const InstitutionRegisterSchema = Joi.object({
  title: Joi.string().max(10).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  institute_name: Joi.string().max(200).required(),
  institute_address: Joi.string().max(1000).required(),
  state: Joi.string().max(100).required(),
  pincode: Joi.string()
    .regex(/^[0-9]{6}$/)
    .messages({ "string.pattern.base": `Pincode must have 6 digits.` })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  confirm_email: Joi.ref("email"),
  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
});

const CampusRegisterSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  middle_name: Joi.string().min(0).max(100),
  last_name: Joi.string().max(100).required(),
  institute_name: Joi.string().max(200).required(),
  institute_address: Joi.string().max(1000).required(),
  state: Joi.string().max(100).required(),
  pincode: Joi.string()
    .regex(/^[0-9]{6}$/)
    .messages({ "string.pattern.base": `Pincode must have 6 digits.` })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  confirm_email: Joi.ref("email"),
  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
  g20_certification_num: Joi.string().max(500).required(),
  reference: Joi.string().max(500).required(),
  social_active: Joi.string().max(500).required(),
  views_on_g20: Joi.string().max(500).required(),
  topics: Joi.array().items(Joi.string()),
});
// ==============ENd Validation Schema's================

//Hashing Password
async function hashingPassword(pass) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
}

//Check Hashing Password
async function checkHashedPass(pass, dbpass) {
  return bcrypt.compare(pass, dbpass).then((result) => {
    return result;
  });
}

module.exports = {
  registerSchema,
  loginSchema,
  hashingPassword,
  checkHashedPass,
  categorySchema,
  productSchema,
  InstitutionRegisterSchema,
  CampusRegisterSchema,
};

// const Joi = require('joi');
// const { InstitutionRegisterSchema, instituteOnboardSchema } = require('../validations/schemas');
// const bcrypt = require('bcrypt');

// const validateInstituteRegistration = (req, res, next) => {
//   const { error } = InstitutionRegisterSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       status: "ERROR",
//       message: error.details[0].message
//     });
//   }
//   next();
// };

// const validateInstituteOnboard = (req, res, next) => {
//   const { error } = instituteOnboardSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       status: "ERROR",
//       message: error.details[0].message
//     });
//   }
//   next();
// };

// const hashingPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };

// const checkHashedPass = async (password, hashedPassword) => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// module.exports = {
//   validateInstituteRegistration,
//   validateInstituteOnboard,
//   hashingPassword,
//   checkHashedPass
// };
