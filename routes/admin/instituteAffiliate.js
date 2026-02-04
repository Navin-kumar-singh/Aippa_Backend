
/*
Institute Affiliation
-get Affiliated Institutes data by A particular Institute 
-Add institutes to affiliates 
-remove Institute from Affiliate 
-Get all Affiliate Institutes
*/

const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

/* 
Functionality: getAllAffiliateInstitute fetching all Affiliated institutes Data.
*/

async function getAllAffiliateInstitute(req, res) {
    try {
        const data = await DBMODELS.institute_affiliate.findAll();
        res.status(200).json({
            message: "Data Fetched",
            result: data
        })
    } catch (error) {
        logg.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/* 
Functionality: getAffiliateInstitute fetching a Affiliated institute Data according to insititute Id.
*/

async function getAffiliateInstitute(req, res) {
    const { id } = req.params;
    if (id) {
        try {
            const data = await DBMODELS.institute_affiliate.findAll({
                where: {
                    instituteId: id
                }
            });
            res.status(200).json({
                message: "Data Fetched",
                result: data
            })
        } catch (error) {
            logg.error(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    } else {
        res.status(404).json({
            message: "Data Not Found"
        })
    }
}


/* 
Functionality: postAffiliateInstitute is adding a institute to a Affiliated institute in insititute_affiliate table.
*/
async function postAffiliateInstitute(req, res) {
    const { id } = req.params;
    if (id) {
        try {
            const data = await DBMODELS.institute_affiliate.findOrCreate({
                where: {
                    instituteId: id
                }


            })
            res.status(200).json({
                message: "Institute Affiliated Successfully",
                result: data
            })
        } catch (error) {
            logg.error(error)
            res.status(500).json({
                message: "Interval Server Error"
            })
        }
    } else {
        res.status(404).json({
            message: "Data Not found"
        })
    }
}


/* 
Functionality: deleteAffiliateInstitute  delete's a institute from its Affiliated institute list from insititute_affiliate table.
*/

async function deleteAffiliateInstitute(req, res) {
    const { id } = req.query;
    if (id) {
        try {
            const data = await DBMODELS.institute_affiliate.destroy({
                where: { id }
            })
            res.status(200).json({
                message: "Removed Institute Affiliated",
                result: data
            })
        } catch (error) {
            logg.error(error)
            res.status(500).json({
                message: "Internal server Error"
            })
        }
    } else {
        res.status(400).json({
            message: "Data Not Found"
        })
    }
}

module.exports = { getAffiliateInstitute, postAffiliateInstitute, deleteAffiliateInstitute, getAllAffiliateInstitute }

