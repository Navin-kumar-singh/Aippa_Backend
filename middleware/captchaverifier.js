/* middleware for captcha verification */

const { verify } = require('hcaptcha');
const logg = require('../utils/utils');
const secret = process.env.HCAPTCHA_SECRET_KEY;

const captchaverifier = (req, res, next) => {
    try {
        const { recaptchavalue } = req.headers;
        if (recaptchavalue) {
            verify(secret, recaptchavalue)
                .then((data) => {
                    if (data.success === true) {
                        req.verify = true;
                        next();
                    } else {
                        return res.json({ status: "error", message: "verification failed" })
                    }
                })
                .catch((err) => {
                    return res.json({ status: "error", message: "verification failed" })
                });
        } else {
            return res.json({ status: "error", message: "verification failed" })
        }
    } catch (error) {
        logg.error(error);
        return res.json({ status: "error", message: "verification failed" })
    }
}
module.exports.captchaverifier = captchaverifier;
