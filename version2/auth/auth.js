const express = require("express");
const { upload } = require("../../service/upload");
const { registerController, loginController,
     forgotController, setpassword, logoutController,
      changePassword, sendEmailOtp,
       newLoginController, 
       resetPasswordEmailSendVersion2,
       resetPasswordEmailController}
        = 
        require("./auth.controller");
const { routeVerifierJwt } = require("./jwt");
const authRoutesV2 = express.Router();

// Register Route
authRoutesV2.post("/register", registerController);
authRoutesV2.post("/login", loginController);
// authRoutesV2.post("/login", (req,res)=>{
//         res.status(200).json({
                
//                 message:"This is wroking"
//         })
// });
authRoutesV2.post("/otp/send", sendEmailOtp);
authRoutesV2.post("/otp/verify", sendEmailOtp);

// new version2 routes
authRoutesV2.post('/v2-login/', newLoginController)
authRoutesV2.get('/v2-reset-password-email/:email', resetPasswordEmailSendVersion2)

authRoutesV2.put('/v2-submit-reset-password-email/:email/:password', resetPasswordEmailController)



module.exports = authRoutesV2;
