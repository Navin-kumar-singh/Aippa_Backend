/*
     Authentication Control Routes
     - routes for the login / forgot password / otp verification for STUDENT INSTITUTED or COORDINATOR
*/

const express = require("express");
const {upload} = require("../../service/upload");
const {
  loginController,
  setpassword,
  changePassword,
  verifyAccount,
  sendVerificationEmail,
  captchaVerifyController,
} = require("./auth.controller");
const {routeVerifierJwt} = require("./jwt");
const {forgetPassword, updatePassword} = require("./reset.controller");
const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/setpassword", setpassword);
authRouter.post(
  "/changepassword",
  upload.single("Noupload"),
  routeVerifierJwt,
  changePassword
);
//New Forgot Password APIs
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/update-password", updatePassword);

// Account Confirm APIs
authRouter.get("/verify-account", verifyAccount);
authRouter.post("/send-verification-email", sendVerificationEmail);

//Captcha 
authRouter.get("/recaptcha-v3", captchaVerifyController);

module.exports = authRouter;
