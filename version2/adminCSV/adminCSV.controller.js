const { DBMODELS } = require("../../database/models/init-models");
const { Sequelize } = require("sequelize");

const emailValidation = async (req, res) => {
  const { email } = req.body;
  try {
    const InstituteInfo = await DBMODELS.institutions.findOne({
      where: {
        email: email,
      },
    });
    if (InstituteInfo) {
      const { id } = InstituteInfo;
      return res.status(200).json({
        message: "Email Validation completed Successfully!!",
        result: id,
      });
    } else {
      return res.status(404).json({ message: "No Such Email Found!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// For saving the CSV from the Admin Panel use -- studentBulkLoginAdmin

const csvInstituteList = async (req, res) => {
  try {
    const instituteIdList = await DBMODELS.all_teacher_student.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("instituteId")), "instituteId"],
      ],
      raw: true,
    });

    const ids = instituteIdList.map((item) => item.instituteId);

    if (ids.length > 0) {
      const instituteDetailsList = await DBMODELS.institutions.findAll({
        where: {
          id: ids,
        },
        attributes: ["id", "institution_name", "email"],
        raw: true,
      });

      return res.status(200).json({
        message: "Email Validation completed Successfully!!",
        result: instituteDetailsList,
      });
    } else {
      return res.status(404).json({ message: "No Such Email Found!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const instituteCSVCount = async (req, res) => {
  const { instituteId } = req.body;
  try {
    const totalCount = await DBMODELS.all_teacher_student.count({
      where: {
        instituteId: instituteId,
      },
    });
    if (totalCount) {
      const instituteDetailCSV = await DBMODELS.all_teacher_student.findAll({
        attributes: [
          "role",
          [Sequelize.fn("COUNT", Sequelize.col("role")), "roleCount"],
        ],
        where: {
          instituteId: instituteId,
        },
        group: ["role"],
        raw: true,
      });

      return res.status(200).json({
        message: "Data retrieved successfully",
        roleCounts: instituteDetailCSV,
        totalCount: totalCount,
      });
    } else {
      return res.status(404).json({ message: "No Data Found!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  emailValidation,
  csvInstituteList,
  instituteCSVCount,
};
