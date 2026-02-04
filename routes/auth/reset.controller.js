const { DBMODELS } = require("../../database/models/init-models");
const sendEmailService = require("../../service/email");
const jwt = require("jsonwebtoken");
const { hashingPassword } = require("./validation");
const logg = require("../../utils/utils");

// forget password and sent reset password link to user's email address
const AccountChecker = async (identifier, attribute) => {
    if (attribute === "email") {
        const checkCoord = await DBMODELS.institute_coordinators.findOne({
            where: {
                email: identifier
            }, raw: true
        });
        const checkInstitute = await DBMODELS.institutions.findOne({
            where: { email: identifier }, raw: true
        });
        const checkStudent = await DBMODELS.students.findOne({
            where: { email: identifier }, raw: true
        });
        const user = checkCoord || checkInstitute || checkStudent;
        let userType;
        switch (user) {
            case checkCoord:
                userType = "institute_coordinators";
                break;
            case checkInstitute:
                userType = "institutions";
                break;
            case checkStudent:
                userType = "students"
                break;
            default:
                userType = null;
                break;
        }
        return { user, userType };
    } else {
        const checkCoord = await DBMODELS.institute_coordinators.findOne({
            where: {
                id: identifier
            }, raw: true
        });
        const checkInstitute = await DBMODELS.institutions.findOne({
            where: { id: identifier }, raw: true
        });
        const checkStudent = await DBMODELS.students.findOne({
            where: { id: identifier }, raw: true
        });
        const user = checkCoord || checkInstitute || checkStudent;
        let userType = null;
        switch (user) {
            case checkCoord:
                userType = "institute_coordinators";
                break;
            case checkInstitute:
                userType = "institutions";
                break;
            case checkStudent:
                userType = "students"
                break;
            default:
                userType = null;
                break;
        }
        return { user, userType };
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists with the given email
        if (email) {
            const { user, userType } = await AccountChecker(email, "email");
            if (user) {
                const token = jwt.sign({
                    userId: user.id, email: user?.email,
                }, process.env.JWT_SECRET, { expiresIn: '10m' });
                // Send email to user with link to reset password
                const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000/'}auth/password-reset/${token}`;
                // Send Email
                const replacements = {
                    name: user?.first_name + " " + user?.last_name,
                    resetUrl: resetUrl
                };
                let mailConfig = {
                    email: user?.email,
                    subject: "Password Reset Request",
                };
                sendEmailService.sendTemplatedEmail(mailConfig, replacements, 'RESET_PASSWORD');
                res.json({ status: "success", message: 'Password reset link sent to your email' });
            } else {
                return res.json({ status: "warning", message: 'User not found' });
            }
        } else {
            res.json({ status: "error", message: "Email Address is required" })
        }
    } catch (error) {
        logg.error(error)
        res.json({ status: "error", message: "Something Went Wrong Please try again later." })
    }


}

// Update password and send success message
const updatePassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token) {
            return res.json({ status: "error", message: 'Invalid request, Please send new reset request again' });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user, userType } = await AccountChecker(decoded?.email, "email");
        // Find the user by userId in token
        if (user) {
            let hashpassword = await hashingPassword(password);
            switch (userType) {
                case "students":
                    updateUserPass = await DBMODELS.students.update({ password: hashpassword }, {
                        where: { id: user.id }
                    })
                    break;
                case "institutions":
                    updateUserPass = await DBMODELS.institutions.update({ password: hashpassword }, {
                        where: { id: user.id }
                    })
                    break;
                case "institute_coordinators":
                    updateUserPass = await DBMODELS.institute_coordinators.update({ password: hashpassword }, {
                        where: { id: user.id }
                    })
                    break;
            }
            res.json({ status: "success", message: "Your password has been successfully changed", })
        } else {
            return res.json({ status: "warning", message: 'User not found' });
        }
    } catch (error) {
        logg.error(error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};


module.exports = {
    AccountChecker,
    forgetPassword,
    updatePassword
}