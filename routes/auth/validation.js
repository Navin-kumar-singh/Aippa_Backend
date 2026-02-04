const Joi = require("joi");
const bcrpyt = require("bcrypt");
/*
             ==============Validation Schema's================
   - Formik form validation Schema for Student registertion / login Form /
     Institution Registretion / product /Campus Register / hash password
*/
const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  middle_name: Joi.string().allow(null, ""),
  last_name: Joi.string().allow(null, ""),
  gender: Joi.string().required(),
  dob: Joi.string().required(),
  instituteId: Joi.number().required(),
  father_name: Joi.string().required().allow(null, ""),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
  password: Joi.string().min(10).required(),
  confirm_password: Joi.string().min(10).required(),
  confirm_email: Joi.string().allow(null, ""),
});
const loginSchema = Joi.object({
  identifier: Joi.required(),
  password: Joi.string().min(8).required(),
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
  middle_name: Joi.string().min(0).max(100),
  last_name: Joi.string().max(100).allow(null, ""),
  institute_name: Joi.string().max(200).required(),
  district: Joi.string().max(1000).required(),
  institute_address: Joi.string().max(1000).required(),
  club: Joi.string().allow(null, ""),
  state: Joi.string().max(100).required(),
  pincode: Joi.string()
    .regex(/^[0-9]{6}$/)
    .messages({ "string.pattern.base": `Pincode must have 6 digits.` })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  confirm_email: Joi.any().valid(Joi.ref("email")).required().messages({
    "any.only": "Email must match",
  }),
  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Password must match",
  }),
});
const AffiliateInstitutionRegisterSchema = Joi.object({
  title: Joi.string().max(10).required(),
  first_name: Joi.string().max(100).required(),
  middle_name: Joi.string().min(0).max(100),
  last_name: Joi.string().max(100),
  institute_name: Joi.string().max(200).required(),
  district: Joi.string().max(1000).required(),
  institute_address: Joi.string().max(1000).required(),
  state: Joi.string().max(100).required(),
  pincode: Joi.string()
    .regex(/^[0-9]{6}$/)
    .messages({ "string.pattern.base": `Pincode must have 6 digits.` })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  confirm_email: Joi.any().valid(Joi.ref("email")).required().messages({
    "any.only": "Email must match",
  }),
  sendemail: Joi.boolean(),
  contact: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
});
const StateFormSchema = Joi.object({
  title: Joi.string().required(),
  subheading: Joi.string().required(),
  quotes: Joi.string().required(),
  author: Joi.string().required(),
  subauthor: Joi.string().required(),
  paragraph: Joi.string().required(),
  images: Joi.string().required(),
  carousel: Joi.string().required(),
  ulpoints: Joi.string().required(),
  cards: Joi.string().required(),
});

const CampusRegisterSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  middle_name: Joi.string().min(0).max(100),
  last_name: Joi.string().max(100),
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
  const salt = await bcrpyt.genSalt(10);
  return await bcrpyt.hash(pass, salt);
}

//Check Hashing Password
async function checkHashedPass(pass, dbpass) {
  return bcrpyt.compare(pass, dbpass).then((result) => {
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
  StateFormSchema,
  CampusRegisterSchema,
  AffiliateInstitutionRegisterSchema,
};
