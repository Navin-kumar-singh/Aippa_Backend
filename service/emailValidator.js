const emailValidator = require('deep-email-validator');
const logg = require('../utils/utils');
const { DBMODELS } = require('../database/models/init-models');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../database/connection');
async function validateEmail(email, subject) {
    try {
        const domain = email.split('@')[1];
        const dblist = await sequelize.query(`SELECT * FROM email_list WHERE email LIKE '%@${domain}' LIMIT 1;`, { type: QueryTypes.SELECT, raw: true });
        console.log(email, dblist);
        let result = dblist[0];
        switch (result?.type) {
            case "blacklist":
            case "complaint":
                return false;
            case "whitelist":
                return true;
            default:
                const { validators } = await emailValidator.validate(email);
                console.log(validators);
                if (validators?.regex?.valid && validators?.typo?.valid) {
                    return true;
                } else {
                    await DBMODELS.email_deliveries.create({ email, subject, status: "not sent", details: JSON.stringify(validators) })
                    return false;
                }
                break;
        }
    } catch (err) {
        logg.warning({ email, err });
        return false;
    }
}

module.exports.validateEmail = validateEmail;