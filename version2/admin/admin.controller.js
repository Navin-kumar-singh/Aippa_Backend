const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op, where, Sequelize } = require("sequelize");
const sendEmailService = require("../../service/email");
const moment = require("moment");
const multer = require("multer");
const xlsx = require("xlsx");
const calling_team_status = require("../../database/models/calling_team_status");

const getUnderReviewInstitute = async (req, res) => {
  try {
    const institutes = await DBMODELS.institute_reg_details.findAll({
      where: {
        is_account_verified: false,
        on_board_status: true,
      },
    });
    return res.json({ institutes });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
const getUnderReviewInstituteById = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const InstituteDetails = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId,
        is_account_verified: false,
        on_board_status: true,
      },
    });
    return res.json(InstituteDetails);
  } catch (error) {
    return res.json({ error: error.message });
  }
};
const approveinstitute = async (req, res) => {
  const { instituteId } = req.params;

  try {
    const institute = await DBMODELS.institute_reg_details.update(
      {
        is_account_verified: true,
      },
      {
        where: {
          institute_id: instituteId,
        },
      }
    );
    if (institute) {
      const instituteDetail = await DBMODELS.institute_reg_details.findOne({
        where: {
          institute_id: instituteId,
        },
        raw: true,
      });
      const replacements = {
        name: `${instituteDetail?.first_name} ${instituteDetail?.last_name}`,
        username: instituteDetail?.email,
      };

      let mailConfig = {
        email: instituteDetail?.email,
        subject: `Your Yuvamanthan institutional account is verified and active!`,
      };
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "Institute_Activate"
      );
    }
    const institutes = await DBMODELS.institute_reg_details.findAll({
      where: {
        is_account_verified: false,
        on_board_status: true,
      },
    });
    return res.json({ institutes });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
const rejectInstitute = async (req, res) => {
  const { instituteId } = req.params;

  try {
  } catch (error) {}
};

const getSingleInstituteData = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const getSingleData = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId,
      },
      attributes: [
        "id",
        "institution_name",
        "email",
        "type_of_inst",
        "type_of_college",
        "education_board",
        "medium_of_education",
        "bio",
        "country",
        "state",
        "street",
        "city",
        "pincode",
        "logo",
        "proof_of_id",
        "proof_of_address",
        "phone",
        "is_account_verified",
        "institute_id",
      ],
    });

    return res
      .status(200)
      .json({ msg: "Successfully get data", getSingleData });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getInsituteDetail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const getInsData = await DBMODELS.institute_reg_details.findAndCountAll({
      where: {
        institute_id: {
          [Op.not]: null,
        },
        is_account_verified: true,
      },
      attributes: [
        "id",
        "institution_name",
        "email",
        "type_of_inst",
        "type_of_college",
        "education_board",
        "medium_of_education",
        "bio",
        "country",
        "state",
        "street",
        "city",
        "pincode",
        "logo",
        "proof_of_id",
        "proof_of_address",
        "phone",
        "is_account_verified",
        "institute_id",
      ],
      order: [["createdAt", "DESC"]],
      offset: page,
      limit,
    });

    return res.status(200).json({ msg: "Successfully get data", getInsData });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const approvedSinglInst = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const approvedSingle = await DBMODELS.institute_reg_details.findOne({
      where: {
        institute_id: instituteId,
      },
      attributes: ["is_account_verified"],
    });

    const updateApproval = approvedSingle?.dataValues?.is_account_verified;
    if (updateApproval === false) {
      await DBMODELS.institute_reg_details.update(
        { is_account_verified: true },
        { where: { institute_id: instituteId } }
      );
      return res
        .status(200)
        .json({ msg: "Approved successfully", updateApproval });
    } else if (updateApproval === true) {
      await DBMODELS.institute_reg_details.update(
        { is_account_verified: false },
        { where: { institute_id: instituteId } }
      );
      return res
        .status(200)
        .json({ msg: "Reject successfully", updateApproval });
    } else {
      return res.status(404).json({ msg: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const deleteSingleInstitute = async (req, res) => {
  const { instituteId } = req.params;
  try {
    const insDetails = await DBMODELS.institutions.findOne({
      where: {
        id: instituteId,
      },
    });
    if (!insDetails) {
      return res.status(404).json({
        success: false,
        message: "Institute Not Found.",
      });
    }
    await DBMODELS.institutions.destroy({
      where: {
        id: instituteId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Institute Deleted Successfully👍👍.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchInstitute = async (req, res) => {
  const { query } = req.query;
  try {
    const searchIns = await DBMODELS.institute_reg_details.findAll({
      where: {
        [Op.or]: [
          { institution_name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
        institute_id: {
          [Op.not]: null,
        },
        is_account_verified: true,
      },
      order: [["createdAt", "DESC"]],
    });
    if (searchIns?.length > 0) {
      return res.status(200).json({ msg: "Successfully retrieved", searchIns });
    } else {
      return res.json({ msg: "No results found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

//========== A function to get under review institute when user search by email or institute name ====\\

const searchUnderReviewDataNew = async (req, res) => {
  const { query } = req.query;
  try {
    const searchIns = await DBMODELS.institute_reg_details.findAll({
      where: {
        [Op.or]: [
          { institution_name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
        institute_id: {
          [Op.not]: null,
        },
        is_account_verified: false,
      },
      order: [["createdAt", "DESC"]],
    });
    if (searchIns?.length > 0) {
      return res.status(200).json({ msg: "Successfully retrieved", searchIns });
    } else {
      return res.json({ msg: "No results found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getInsituteByDate = async (req, res) => {
  const { startDate, endDate, type } = req.params;
  const startDateFormatted = moment(startDate, "YYYY-MM-DD")
    .startOf("day")
    .toDate();
  const endDateFormatted = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();

  // switch (type) {
  //   case "submit":
  if (type === "submit") {
    try {
      const result = await DBMODELS.institute_reg_details.findAll({
        where: {
          institute_id: {
            [Op.not]: null,
          },
          is_account_verified: true,
          createdAt: {
            [Op.gte]: startDateFormatted,
            [Op.lte]: endDateFormatted,
          },
        },
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "institution_name",
          "institute_id",
          [
            sequelize.literal(`
            (select concat(first_name, ' ', last_name) from institutions as i
              where i.id = institute_reg_details.institute_id
            )`),
            "adminName",
          ],
          "email",
          "phone",
          [sequelize.col("is_account_verified"), "status"],
          [sequelize.col("createdAt"), "Register_Date"],
          [
            sequelize.literal(`
            (select count(*) from students as s 
            where s.instituteId = institute_reg_details.institute_id
            )`),
            "total_students",
          ],
          "state",
          "city",
          "logo",
        ],
      });
      return res.status(200).json({ msg: "Get data by date", result });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server error", error: error.message });
    }
  } else if (type === "download") {
    try {
      const result = await DBMODELS.institute_reg_details.findAll({
        where: {
          institute_id: {
            [Op.not]: null,
          },

          createdAt: {
            [Op.gte]: startDateFormatted,
            [Op.lte]: endDateFormatted,
          },
        },
        order: [["createdAt", "DESC"]],
        attributes: [
          "institution_name",
          [
            sequelize.literal(`
                  (select concat(first_name, ' ',last_name) from institutions as i
                    where i.id = institute_reg_details.institute_id
                  )`),
            "adminName",
          ],
          "email",
          "phone",
          [sequelize.col("is_account_verified"), "status"],
          [sequelize.col("createdAt"), "Register_Date"],
          [
            sequelize.literal(`
                  (select count(*) from students as s 
                  where s.instituteId = institute_reg_details.institute_id
                  )`),
            "total_students",
          ],
          "state",
          "city",
        ],
      });
      return res.status(200).json({ msg: "Get data by date", result });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server error", error: error.message });
    }
  }
  //   case "nipamData":
  //     try {
  //       const query = `
  //     SELECT
  //       i.institution_name,
  //       CONCAT(i.first_name, ' ', i.last_name) AS name,
  //       i.email,
  //       i.contact,
  //       i.status,
  //       i.logo,
  //       i.createdAt AS Regist_date,
  //       (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //       i.state,
  //       i.district
  //     FROM
  //       institutions i
  //     JOIN
  //       nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //     WHERE
  //       i.createdAt >= :startDate AND i.createdAt <= :endDate
  //   `;
  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get data with date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }
  //   case "downloadNipam":
  //     try {
  //       const query = `
  //     SELECT
  //       i.institution_name,
  //       CONCAT(i.first_name, ' ', i.last_name) AS name,
  //       i.email,
  //       i.contact,
  //       i.status,
  //       i.logo,
  //       i.createdAt AS Regist_date,
  //       (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //       i.state,
  //       i.district
  //     FROM
  //       institutions i
  //     JOIN
  //       nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //     WHERE
  //       i.createdAt >= :startDate AND i.createdAt <= :endDate
  //   `;
  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get data with date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }
  //   case "nipamWithoutKv":
  //     try {
  //       const query = `SELECT
  //     i.institution_name,
  //     CONCAT(i.first_name, ' ', i.last_name) AS name,
  //     i.email,
  //     i.contact,
  //     i.status,
  //     i.logo,
  //     i.createdAt AS Regist_date,
  //     (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //     i.state,
  //     i.district
  //   FROM
  //     institutions i
  //   JOIN
  //     nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //   WHERE
  //     i.createdAt >= :startDate AND i.createdAt <= :endDate
  //     AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;
  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get nipam data without kv date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }

  //   case "downloadNipamWithoutKv":
  //     try {
  //       const query = `SELECT
  //     i.institution_name,
  //     CONCAT(i.first_name, ' ', i.last_name) AS name,
  //     i.email,
  //     i.contact,
  //     i.status,
  //     i.createdAt AS Regist_date,
  //     (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //     i.state,
  //     i.district
  //   FROM
  //     institutions i
  //   JOIN
  //     nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //   WHERE
  //     i.createdAt >= :startDate AND i.createdAt <= :endDate
  //     AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;
  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get nipam data without kv date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }

  //   case "nipamWithKv":
  //     try {
  //       const query = `SELECT
  //   i.institution_name,
  //   CONCAT(i.first_name, ' ', i.last_name) AS name,
  //   i.email,
  //   i.contact,
  //   i.status,
  //   i.createdAt AS Regist_date,
  //   (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //   i.state,
  //   i.district
  // FROM
  //   institutions i
  // JOIN
  //   nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  // WHERE
  //   i.createdAt >= :startDate AND i.createdAt <= :endDate
  //   AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;
  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get nipam data with kv date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }
  //   case "downloadNipamWithKv":
  //     try {
  //       const query = `SELECT
  //           i.institution_name,
  //           CONCAT(i.first_name, ' ', i.last_name) AS name,
  //           i.email,
  //           i.contact,
  //           i.status,
  //           i.createdAt AS Regist_date,
  //           (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  //           i.state,
  //           i.district
  //         FROM
  //           institutions i
  //         JOIN
  //           nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //         WHERE
  //           i.createdAt >= :startDate AND i.createdAt <= :endDate
  //           AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

  //       const results = await sequelize.query(query, {
  //         replacements: {
  //           startDate: startDateFormatted,
  //           endDate: endDateFormatted,
  //         },
  //         type: sequelize.QueryTypes.SELECT,
  //       });
  //       return res.status(200).json({ msg: "Get nipam data with kv date", result: results });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server Error", error: error.message });
  //     }

  //   case "download":
  //     try {
  //       const result = await DBMODELS.institute_reg_details.findAll({
  //         where: {
  //           institute_id: {
  //             [Op.not]: null,
  //           },

  //           createdAt: {
  //             [Op.gte]: startDateFormatted,
  //             [Op.lte]: endDateFormatted,
  //           },
  //         },
  //         order: [["createdAt", "DESC"]],
  //         attributes: [
  //           "institution_name",
  //           [
  //             sequelize.literal(`
  //                 (select concat(first_name," ",last_name) from institutions as i
  //                   where i.id = institute_reg_details.institute_id
  //                 )`),
  //             "adminName",
  //           ],
  //           "email",
  //           "phone",
  //           [sequelize.col("is_account_verified"), "status"],
  //           [sequelize.col("createdAt"), "Register_Date"],
  //           [
  //             sequelize.literal(`
  //                 (select count(*) from students as s
  //                 where s.instituteId = institute_reg_details.institute_id
  //                 )`),
  //             "total_students",
  //           ],
  //           "state",
  //           "city",
  //         ],
  //       });
  //       return res.status(200).json({ msg: "Get data by date", result });
  //     } catch (error) {
  //       return res.status(500).json({ msg: "Server error", error: error.message });
  //     }
  //   default:
  // return res.status(400).json({ error: "Invalid type specified" });
};
// }

// const getInsituteByDate = async (req, res) => {
//   const { startDate, endDate, type } = req.params;
//   try {
//     const startDateFormatted = moment(startDate, 'YYYY-MM-DD').startOf('day').toDate();
//     const endDateFormatted = moment(endDate, 'YYYY-MM-DD').endOf('day').toDate();

//     if(type === 'submit'){
//       const result = await DBMODELS.institute_reg_details.findAll({
//         where: {
//           institute_id: {
//             [Op.not]: null
//           },

//           createdAt: {
//             [Op.gte]: startDateFormatted,
//             [Op.lte]: endDateFormatted,
//           },
//         },
//         order: [['createdAt', 'DESC']],
//         attributes: [
//           'id',
//           'institution_name',
//           [sequelize.literal(`
//           (select concat(first_name," ",last_name) from institutions as i
//             where i.id = institute_reg_details.institute_id
//           )`), 'adminName'],
//           'email',
//           'phone',
//           [sequelize.col('is_account_verified'), 'status'],
//           [sequelize.col('createdAt'), 'Register_Date'],
//           [sequelize.literal(`
//           (select count(*) from students as s
//           where s.instituteId = institute_reg_details.institute_id
//           )`),'total_students'],
//           'state',
//           'city',
//           'logo'
//         ],
//       });
//     return res.status(200).json({ msg: 'Get data by date', result});
//     }
//     else if(type === 'nipamData'){
//       const query = `
//       SELECT
//         i.institution_name,
//         CONCAT(i.first_name, ' ', i.last_name) AS name,
//         i.email,
//         i.contact,
//         i.status,
//         i.logo,
//         i.createdAt AS Regist_date,
//         (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//         i.state,
//         i.district
//       FROM
//         institutions i
//       JOIN
//         nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//       WHERE
//         i.createdAt >= :startDate AND i.createdAt <= :endDate
//     `;
//     try {
//       const results = await sequelize.query(query, {
//         replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//         type: sequelize.QueryTypes.SELECT
//       });
//       return res.status(200).json({ msg: 'Get data with date', result: results });
//     } catch (error) {
//       return res.status(500).json({ error: 'Internal Server Error', message: error.message });
//     }
//     }
//     else if(type === 'downloadNipam'){
//       const query = `
//       SELECT
//         i.institution_name,
//         CONCAT(i.first_name, ' ', i.last_name) AS name,
//         i.email,
//         i.contact,
//         i.status,
//         i.logo,
//         i.createdAt AS Regist_date,
//         (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//         i.state,
//         i.district
//       FROM
//         institutions i
//       JOIN
//         nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//       WHERE
//         i.createdAt >= :startDate AND i.createdAt <= :endDate
//     `;
//     try {
//       const results = await sequelize.query(query, {
//         replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//         type: sequelize.QueryTypes.SELECT
//       });
//       return res.status(200).json({ msg: 'Get data with date', result: results });
//     } catch (error) {
//       return res.status(500).json({ error: 'Internal Server Error', message: error.message });
//     }
//     }
//     else if(type === 'nipamWithoutKv'){
//       const query = `SELECT
//       i.institution_name,
//       CONCAT(i.first_name, ' ', i.last_name) AS name,
//       i.email,
//       i.contact,
//       i.status,
//       i.logo,
//       i.createdAt AS Regist_date,
//       (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//       i.state,
//       i.district
//     FROM
//       institutions i
//     JOIN
//       nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//     WHERE
//       i.createdAt >= :startDate AND i.createdAt <= :endDate
//       AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

//     try {
//       const results = await sequelize.query(query, {
//         replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//         type: sequelize.QueryTypes.SELECT
//       });
//       return res.status(200).json({ msg: 'Get nipam data without kv date', result: results });
//     } catch (error) {
//       return res.status(500).json({ msg: 'Server Error', error: error.message });
//     }
//     }
//     else if(type === 'downloadNipamWithoutKv'){
//       const query = `SELECT
//       i.institution_name,
//       CONCAT(i.first_name, ' ', i.last_name) AS name,
//       i.email,
//       i.contact,
//       i.status,
//       i.createdAt AS Regist_date,
//       (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//       i.state,
//       i.district
//     FROM
//       institutions i
//     JOIN
//       nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//     WHERE
//       i.createdAt >= :startDate AND i.createdAt <= :endDate
//       AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;
//     try {
//       const results = await sequelize.query(query, {
//         replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//         type: sequelize.QueryTypes.SELECT
//       });
//       return res.status(200).json({ msg: 'Get nipam data without kv date', result: results });
//     } catch (error) {
//       return res.status(500).json({ msg: 'Server Error', error: error.message });
//     }
//     }
//     else if(type === 'nipamWithKv'){
//       const query = `SELECT
//     i.institution_name,
//     CONCAT(i.first_name, ' ', i.last_name) AS name,
//     i.email,
//     i.contact,
//     i.status,
//     i.createdAt AS Regist_date,
//     (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//     i.state,
//     i.district
//   FROM
//     institutions i
//   JOIN
//     nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//   WHERE
//     i.createdAt >= :startDate AND i.createdAt <= :endDate
//     AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

//   try {
//     const results = await sequelize.query(query, {
//       replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//       type: sequelize.QueryTypes.SELECT
//     });
//     return res.status(200).json({ msg: 'Get nipam data with kv date', result: results });
//   } catch (error) {
//     return res.status(500).json({ msg: 'Server Error', error: error.message });
//   }
//     }
//     else if(type === 'downloadNipamWithKv'){
//       const query = `SELECT
//     i.institution_name,
//     CONCAT(i.first_name, ' ', i.last_name) AS name,
//     i.email,
//     i.contact,
//     i.status,
//     i.createdAt AS Regist_date,
//     (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
//     i.state,
//     i.district
//   FROM
//     institutions i
//   JOIN
//     nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
//   WHERE
//     i.createdAt >= :startDate AND i.createdAt <= :endDate
//     AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

//   try {
//     const results = await sequelize.query(query, {
//       replacements: { startDate: startDateFormatted, endDate: endDateFormatted },
//       type: sequelize.QueryTypes.SELECT
//     });
//     return res.status(200).json({ msg: 'Get nipam data with kv date', result: results });
//   } catch (error) {
//     return res.status(500).json({ msg: 'Server Error', error: error.message });
//   }

//     }
//     else if(type === 'download'){
//       const result = await DBMODELS.institute_reg_details.findAll({
//         where: {
//           institute_id: {
//             [Op.not]: null
//           },

//           createdAt: {
//             [Op.gte]: startDateFormatted,
//             [Op.lte]: endDateFormatted,
//           },
//         },
//         order: [['createdAt', 'DESC']],
//         attributes: [
//           'institution_name',
//           [sequelize.literal(`
//           (select concat(first_name," ",last_name) from institutions as i
//             where i.id = institute_reg_details.institute_id
//           )`), 'adminName'],
//           'email',
//           'phone',
//           [sequelize.col('is_account_verified'), 'status'],
//           [sequelize.col('createdAt'), 'Register_Date'],
//           [sequelize.literal(`
//           (select count(*) from students as s
//           where s.instituteId = institute_reg_details.institute_id
//           )`),'total_students'],
//           'state',
//           'city',
//         ],
//       });
//     return res.status(200).json({ msg: 'Get data by date', result});
//     }
//   } catch (error) {
//     return res.status(500).json({ msg: 'Server error', message: error.message });
//   }
// }

// getNipamData
const getNipamData = async (req, res) => {
  const query = `
    SELECT 
      i.id,
      i.institution_name, 
      CONCAT(i.first_name, ' ', i.last_name) AS name, 
      i.email, 
      i.contact, 
      i.status, 
      i.logo,
      i.createdAt AS Regist_date,
      (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students, 
      i.state, 
      i.district
    FROM 
      institutions i
    JOIN 
      nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
      ORDER BY 
      i.createdAt DESC
      `;
  // LIMIT ${limit} OFFSET ${offset}
  try {
    // const [totalCountResult, results] = await Promise.all([
    //   sequelize.query(totalCountQuery),
    //   sequelize.query(query)
    // ]);
    // const totalCount = totalCountResult[0][0].totalCount;
    const results = await sequelize.query(query);
    return res.status(200).json({ msg: "Get nipam data", result: results[0] });
  } catch (error) {
    console.error("Error executing MySQL query: " + error.stack);
    return res
      .status(500)
      .json({ error: "Internal Server Error", error: error.message });
  }
};

// allNipamDatawithDate----
const allNipamWithDate = async (req, res) => {
  const { startDate, endDate, type } = req.params;
  // console.log("type---***", type, 'startDate', startDate, 'endDate', endDate)
  const startDateFormatted = moment(startDate, "YYYY-MM-DD")
    .startOf("day")
    .toDate();
  const endDateFormatted = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
  // console.log('startDateFormatted', startDateFormatted)

  if (type === "nipamDataSubmit") {
    const query = `
      SELECT 
        i.institution_name, 
        CONCAT(i.first_name, ' ', i.last_name) AS name, 
        i.email, 
        i.contact, 
        i.status, 
        i.logo,
        i.createdAt AS Regist_date,
        (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students, 
        i.state, 
        i.district
      FROM 
        institutions i
      JOIN 
        nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
      WHERE 
        i.createdAt >= :startDate AND i.createdAt <= :endDate
    `;

    try {
      const results = await sequelize.query(query, {
        replacements: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      return res
        .status(200)
        .json({ msg: "Get data with date", result: results });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  } else if (type === "download") {
    const query = `
    SELECT 
      i.institution_name, 
      CONCAT(i.first_name, ' ', i.last_name) AS name, 
      i.email, 
      i.contact, 
      i.status, 
      i.logo,
      i.createdAt AS Regist_date,
      (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students, 
      i.state, 
      i.district
    FROM 
      institutions i
    JOIN 
      nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
    WHERE 
      i.createdAt >= :startDate AND i.createdAt <= :endDate
  `;

    try {
      const results = await sequelize.query(query, {
        replacements: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      return res
        .status(200)
        .json({ msg: "Get data with date", result: results });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  } else if (type === "nipamWithKv") {
    const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    i.createdAt >= :startDate AND i.createdAt <= :endDate
    AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

    try {
      const results = await sequelize.query(query, {
        replacements: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      return res
        .status(200)
        .json({ msg: "Get nipam data with kv date", result: results });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error", error: error.message });
    }
  } else if (type === "downloadNipamWithKv") {
    // console.log('type', downloadNipamWithKv)
    const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.logo,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    i.createdAt >= :startDate AND i.createdAt <= :endDate
    AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

    try {
      const results = await sequelize.query(query, {
        replacements: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      return res
        .status(200)
        .json({ msg: "Get nipam data with kv date", result: results });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error", error: error.message });
    }
  } else if (type === "nipamWithoutKv") {
    const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.logo,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')
    `;

    try {
      const results = await sequelize.query(query);
      return res
        .status(200)
        .json({ msg: "Get nipam data without kv", result: results[0] });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error", error: error.message });
    }
  } else if (type === "downloadNipamWithKv") {
    // console.log("type", downloadNipamWithKv)
    const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.logo,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    i.createdAt >= :startDate AND i.createdAt <= :endDate
    AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

    try {
      const results = await sequelize.query(query, {
        replacements: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
        type: sequelize.QueryTypes.SELECT,
      });
      return res
        .status(200)
        .json({ msg: "Get nipam data without kv date", result: results });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error", error: error.message });
    }
  }
};

// getNipamWithoutKv----
const getNipamWithoutKv = async (req, res) => {
  const query = `SELECT 
  i.institution_name,
  CONCAT(i.first_name, ' ', i.last_name) AS name,
  i.email,
  i.contact,
  i.status,
  i.logo,
  i.createdAt AS Regist_date,
  (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  i.state,
  i.district
FROM 
  institutions i
JOIN 
  nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
WHERE 
  NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')
  `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS totalCount
  //   FROM institutions i
  //   JOIN nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  //   WHERE NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')
  // `;

  try {
    // const [results, metadata] = await Promise.all([
    //   sequelize.query(query),
    //   sequelize.query(countQuery, { plain: true }),
    // ]);

    // const totalCount = metadata.totalCount;

    const results = await sequelize.query(query);
    return res
      .status(200)
      .json({ msg: "Get nipam data without kv", result: results[0] });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// getNipamWithoutKvDate----
const getNipamWithoutKvDate = async (req, res) => {
  const { startDate, endDate } = req.params;
  const startDateFormatted = moment(startDate, "YYYY-MM-DD")
    .startOf("day")
    .toDate();
  const endDateFormatted = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
  const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.logo,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    i.createdAt >= :startDate AND i.createdAt <= :endDate
    AND NOT (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

  try {
    const results = await sequelize.query(query, {
      replacements: {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    return res
      .status(200)
      .json({ msg: "Get nipam data without kv date", result: results });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// getNipamwithKv----
const getNipamWithKv = async (req, res) => {
  const query = `SELECT 
  i.institution_name,
  CONCAT(i.first_name, ' ', i.last_name) AS name,
  i.email,
  i.contact,
  i.status,
  i.logo,
  i.createdAt AS Regist_date,
  (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
  i.state,
  i.district
FROM 
  institutions i
JOIN 
  nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
WHERE 
  (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')
  `;

  const countQuery = `
  SELECT COUNT(*) AS totalCount
  FROM institutions i
  JOIN 
  nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
WHERE 
  (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')
`;

  try {
    // const [results, metadata] = await Promise.all([
    //   sequelize.query(query),
    //   sequelize.query(countQuery, { plain: true }),
    // ]);

    // const totalCount = metadata.totalCount;
    const results = await sequelize.query(query);
    return res
      .status(200)
      .json({ msg: "Get nipam data with kv", result: results[0] });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// getNipamKvDate----
const getNipamWithKvDate = async (req, res) => {
  const { startDate, endDate } = req.params;
  const startDateFormatted = moment(startDate, "YYYY-MM-DD")
    .startOf("day")
    .toDate();
  const endDateFormatted = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
  const query = `SELECT 
    i.institution_name,
    CONCAT(i.first_name, ' ', i.last_name) AS name,
    i.email,
    i.contact,
    i.status,
    i.createdAt AS Regist_date,
    (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students,
    i.state,
    i.district
  FROM 
    institutions i
  JOIN 
    nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
  WHERE 
    i.createdAt >= :startDate AND i.createdAt <= :endDate
    AND (i.email LIKE '%kv%' OR i.institution_name LIKE '%kend%' OR i.institution_name LIKE '%kv%')`;

  try {
    const results = await sequelize.query(query, {
      replacements: {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    return res
      .status(200)
      .json({ msg: "Get nipam data with kv date", result: results });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getSearchNipamData = async (req, res) => {
  const { query } = req.query;

  const searchquery = `
    SELECT 
      i.id,
      i.institution_name, 
      CONCAT(i.first_name, ' ', i.last_name) AS name, 
      i.email, 
      i.contact, 
      i.status, 
      i.logo,
      i.createdAt AS Regist_date,
      (SELECT COUNT(*) FROM students s WHERE s.instituteId = i.id) AS total_students, 
      i.state, 
      i.district
    FROM 
      institutions i
    JOIN 
      nipam_institute n ON i.email = n.email COLLATE UTF8MB4_GENERAL_CI
      ${
        query
          ? `WHERE i.institution_name LIKE '%${query}%' OR i.email LIKE '%${query}%'`
          : ""
      }
      ORDER BY 
      i.createdAt DESC
      `;
  try {
    const results = await sequelize.query(searchquery);
    return res.status(200).json({ msg: "Get nipam data", result: results[0] });
  } catch (error) {
    console.error("Error executing MySQL query: " + error.stack);
    return res
      .status(500)
      .json({ error: "Internal Server Error", error: error.message });
  }
};

// CbseDataUpoad
const cbseDataUpload = async (req, res) => {
  const file = req.file;
  let fileType = file?.originalname.split(".").slice(-1);
  if (
    file &&
    (fileType[0] === "csv" || fileType[0] === "xlsx" || fileType[0] === "xls")
  ) {
    const fileData = xlsx.readFile(file.path, { skiprows: 0 });
    const sheetNames = fileData.SheetNames;
    const totalSheets = sheetNames.length;
    let parsedData = [];
    for (let i = 0; i < totalSheets; i++) {
      // Convert to json using xlsx
      const tempData = xlsx.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]);
      // Skip header row which is the colum names
      // tempData.shift();
      // Add the sheet's json to our data array
      parsedData.push(...tempData);
      req.json = parsedData;
      try {
        const result = await DBMODELS.institutecbse_details.bulkCreate(
          parsedData
        );
        return res.status(201).json({ msg: "Data post sucessfully", result });
      } catch (error) {
        return res
          .status(500)
          .json({ msg: "Server error", error: error.message });
      }
    }
  } else if (file) {
    res.status(205).json({ message: "File Format Not Supported!" });
  } else {
    res.status(205).json({ message: "File Not Found!" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const uploader = multer({ storage: storage });

// Get all cbse details
const getAllCbseDetail = async (req, res) => {
  try {
    const cbseDetails = await DBMODELS.institutecbse_details.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`
            (
              SELECT call_status
              from calling_team_status as c
              where c.schoolId = institutecbse_details.id
              ORDER BY c.createdAt DESC
              LIMIT 1
            )
          `),
            "call_status",
          ],
          [
            Sequelize.literal(`
          (
            SELECT reminder_status
            from calling_team_status as c
            where c.schoolId = institutecbse_details.id
            ORDER BY c.createdAt DESC
            LIMIT 1
          )
        `),
            "reminder_status",
          ],
          [
            Sequelize.literal(`
        (
          SELECT detail_sent_status
          from calling_team_status as c
          where c.schoolId = institutecbse_details.id
          ORDER BY c.createdAt DESC
          LIMIT 1
        )
      `),
            "detail_sent_status",
          ],
          [
            Sequelize.literal(`
      (
        SELECT registration_status
        from calling_team_status as c
        where c.schoolId = institutecbse_details.id
        ORDER BY c.createdAt DESC
        LIMIT 1
      )
    `),
            "registration_status",
          ],
        ],
      },
    });
    return res.status(200).json({ msg: "Get successfully", cbseDetails });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get singleCbseData
const getSingleCbseData = async (req, res) => {
  const { id } = req.params;
  try {
    const getSingleData = await DBMODELS.institutecbse_details.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const getAltData = await DBMODELS.institutecbse_alt_details.findAll({
      where: {
        school_id: id,
      },
      raw: true,
    });

    const emailsAndContacts = getAltData.map((record) => ({
      email: record.email,
      contact: record.contact,
    }));

    getSingleData.email = [
      getSingleData.email,
      ...emailsAndContacts.map((record) => record.email),
    ];

    getSingleData.contact = [
      getSingleData.contact,
      ...emailsAndContacts.map((record) => record.contact),
    ];

    //console.log(getSingleData);
    return res
      .status(200)
      .json({ msg: "Successfully get single data", getSingleData });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// post
const addSingleCbseAltData = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobileNumber, email } = req.body;

    const getSingleData = await DBMODELS.institutecbse_details.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const altNateDetail = await DBMODELS.institutecbse_alt_details.create({
      school_id: id,
      affiliate_number: getSingleData.affliate_number,
      email: email,
      contact: mobileNumber,
    });

    res.status(200).json({ msg: "Added in alt table", altNateDetail });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const addMultiCbseAltData = async (req, res) => {
  try {
    const { id } = req.params;
    const { phoneNumbers, emails } = req.body;

    const getSingleData = await DBMODELS.institutecbse_details.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const altNateDetail = await DBMODELS.institutecbse_alt_details.bulkCreate([
      {
        school_id: id,
        affiliate_number: getSingleData.affliate_number,
        email: emails,
        contact: phoneNumbers,
      },
    ]);

    res.status(200).json({ msg: "Added in alt table", altNateDetail });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// get subAdminData
const getSubadminData = async (req, res) => {
  try {
    // const getSubAdmin = await DBMODELS.admin.findAll({
    //   where: {
    //     role: 'subAdmin'
    //   },
    //   attributes: [
    //     'first_name',
    //     'middle_name',
    //     'last_name',
    //     [sequelize.literal(`
    //       COALESCE(first_name, '') || ' ' || COALESCE(middle_name, '') || ' ' || COALESCE(last_name, '')
    //     `), 'full_name']
    //     [sequelize.literal(`
    //       COALESCE(first_name, '') || ' ' || COALESCE(middle_name, '') || ' ' || COALESCE(last_name, '')
    //     `), 'vlaue']
    //   ]
    // });
    const query = `
        SELECT
        id,
        first_name,
        middle_name,
        last_name,
        concat(first_name, ' ', last_name) AS full_name,
        concat(first_name, ' ', last_name) AS value
        FROM admin
        WHERE
        role = 'subAdmin';
      `;
    const selectData = await sequelize.query(query, {
      // replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });
    return res
      .status(200)
      .json({ msg: "get admin data", getSubAdmin: selectData });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getUniqueState = async (req, res) => {
  try {
    const getState = await DBMODELS.data_provider.findAll();
    return res.status(200).json({ msg: "Get all state", getState });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// admin set state and district
const createAssignData = async (req, res) => {
  const { subAdmin_Id, state, district, projects } = req.body;
  // console.log(subAdmin_Id, state, district, projects)
  const bulkData = subAdmin_Id.map((id) => ({
    subAdmin_Id: id,
    state,
    district,
    projects,
  }));
  try {
    const createAssign = await DBMODELS.data_provider.bulkCreate(bulkData);
    return res
      .status(201)
      .json({ msg: "Successfully created assign data", createAssign });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// getdataProvider id

// api jo params subadminId => state , district
// const getAssignData = await DBMODELS.data_provider.findAll({
//   attributes: [
//
//     'state',
//     'district',
//   ],where:{subadi}
//   raw: true
// })

// get all assign data
const getAllAsignData = async (req, res) => {
  try {
    const allAssignData = await DBMODELS.data_provider.findAll({
      attributes: [
        "id",
        "subAdmin_Id",
        "state",
        "district",
        "projects",
        [
          sequelize.literal(`
      (select concat(coalesce(first_name, ''), ' ',coalesce(middle_name, ''), ' ',coalesce(last_name, '')) from admin as i
        where i.id = data_provider.subAdmin_Id
      )`),
          "subAdmin",
        ],
      ],
    });
    return res
      .status(200)
      .json({ msg: "Get all the assign data", allAssignData });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// getAllStateDataName
const getAllStateName = async (req, res) => {
  try {
    const getState = await DBMODELS.institutecbse_details.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("state")), "state"]],
    });
    return res.status(200).json({ msg: "Get all states", states: getState });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server error", error: error.message });
  }
};

// getAllDistrictDataName
const getAllDistrictName = async (req, res) => {
  const { state } = req.params;
  // console.log(state)
  try {
    const getDistrict = await DBMODELS.institutecbse_details.findAll({
      where: {
        state,
      },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("district")), "district"],
        [Sequelize.col("district"), "value"],
      ],
    });
    return res
      .status(200)
      .json({ msg: "Get all district", district: getDistrict });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server error", error: error.message });
  }
};

// getAssignedData
const getStateAssignedData = async (req, res) => {
  const { id } = req.params;
  try {
    const getAssigned = await DBMODELS.data_provider.findAll({
      where: {
        subAdmin_Id: id,
      },
    });
    return res.status(200).json({ msg: "Get assigned data", getAssigned });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// get single assign data
const getAssignData = async (req, res) => {
  const { subAdmin_Id } = req.params;
  try {
    const getAssignSingle = await DBMODELS.data_provider.findOne({
      where: {
        subAdmin_Id,
      },
    });
    return res
      .status(200)
      .json({ msg: "Successfully get data", getAssignSingle });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server error", error: error.message });
  }
};

// find all the data on basis of state, district
const getBasedOnStateDistrict = async (req, res) => {
  const { state } = req.params;
  try {
    const getCbseData = await DBMODELS.institutecbse_details.findAll({
      where: {
        state: state,
        // district: district
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`
            (
              SELECT call_status
              from calling_team_status as c
              where c.schoolId = institutecbse_details.id
              ORDER BY c.createdAt DESC
              LIMIT 1
            )
          `),
            "call_status",
          ],
          [
            Sequelize.literal(`
          (
            SELECT reminder_status
            from calling_team_status as c
            where c.schoolId = institutecbse_details.id
            ORDER BY c.createdAt DESC
            LIMIT 1
          )
        `),
            "reminder_status",
          ],
          [
            Sequelize.literal(`
        (
          SELECT detail_sent_status
          from calling_team_status as c
          where c.schoolId = institutecbse_details.id
          ORDER BY c.createdAt DESC
          LIMIT 1
        )
      `),
            "detail_sent_status",
          ],
          [
            Sequelize.literal(`
      (
        SELECT registration_status
        from calling_team_status as c
        where c.schoolId = institutecbse_details.id
        ORDER BY c.createdAt DESC
        LIMIT 1
      )
    `),
            "registration_status",
          ],
        ],
      },
    });
    return res
      .status(200)
      .json({ msg: "Get Data State and district wise", getCbseData });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// get Single subadmin state data
const getSingleSubadminData = async (req, res) => {
  const { id } = req.params;
  try {
    const singleSubadminStateData =
      await DBMODELS.institutecbse_details.findOne({
        where: {
          id,
        },
        attributes: [
          "affliate_number",
          "institution_name",
          "address",
          "state",
          "district",
          "email",
          "contact",
          "pincode",
          "stdcode",

          [
            sequelize.literal(`
      (SELECT projects
        FROM data_provider AS c
        WHERE c.state = institutecbse_details.state
        ORDER BY projects ASC
        LIMIT 1
      )
    `),
            "projects",
          ],
        ],
      });
    // const singleSubadminStateData = await sequelize.query(query, {
    //   replacements: { id },
    //   type: sequelize.QueryTypes.SELECT
    // });
    const getAltData = await DBMODELS.institutecbse_alt_details.findAll({
      where: {
        school_id: id,
      },
      raw: true,
    });

    const emailsAndContacts = getAltData.map((record) => ({
      email: record.email,
      contact: record.contact,
    }));

    singleSubadminStateData.dataValues.email = [
      singleSubadminStateData.dataValues.email,
      ...emailsAndContacts.map((record) => record.email),
    ];

    singleSubadminStateData.dataValues.contact = [
      singleSubadminStateData.dataValues.contact,
      ...emailsAndContacts.map((record) => record.contact),
    ];

    return res
      .status(200)
      .json({ msg: "Get subamin state", singleSubadminStateData });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// add cbse data to subadmin
const getDataToSubadmin = async (req, res) => {
  try {
    const getAssignData = await DBMODELS.data_provider.findAll({
      attributes: ["subAdmin_Id", "state", "district"],
      raw: true,
    });

    const query = `
    SELECT * from institutecbse_details where state = 
    `;
    const getCbseData = await DBMODELS.institutecbse_details.findAll({
      where: {
        state: getAssignData?.state,
        district: getAssignData?.district,
      },
    });
    return res.status(200).json({ msg: "Get cbse data", getCbseData });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// delete cbse details
const deleteCbseDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCbse = await DBMODELS.institutecbse_details.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({ msg: "Deleted Successfully", deleteCbse });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Admin Comments
const adminCommentsCreated = async (req, res) => {
  const body = req.body;
  try {
    const adminCreatedComments = await DBMODELS.admin_comments.create(body);
    return res
      .status(201)
      .json({ msg: "Comments created", adminCreatedComments });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const instituteDetail = await DBMODELS.institutecbse_details.findOne({
      where: {
        id: id,
      },
      raw: true,
      attributes: ["id"],
    });

    if (!instituteDetail) {
      return res.status(404).json({ msg: "Institute detail not found" });
    }

    const getAllComments = await DBMODELS.admin_comments.findAll({
      where: {
        postId: instituteDetail.id,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ msg: "Get Comments", getAllComments });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// eidtComments
const editComments = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const editCommentsData = await DBMODELS.admin_comments.update(body, {
      where: {
        id,
      },
    });
    return res
      .status(200)
      .json({ msg: "Successfully updated", editCommentsData });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const schoolCallingStatus = async (req, res) => {
  const { schoolId } = req.params;
  const body = req.body;
  try {
    const schoolStatus = await DBMODELS.calling_team_status.findOne({
      where: {
        schoolId,
      },
    });
    if (schoolStatus) {
      const updateSchoolStatus = await DBMODELS.calling_team_status.update(
        body,
        {
          where: {
            schoolId,
          },
        }
      );
      if (updateSchoolStatus) {
        return res.status(200).json({ msg: "Status updated successfully" });
      } else {
        return res.status(500).json({ msg: "Server error" });
      }
    }
    const addSchoolStatus = await DBMODELS.calling_team_status.create({
      ...body,
      schoolId: schoolId,
    });
    if (addSchoolStatus) {
      return res.status(200).json({ msg: "Status added successfully" });
    } else {
      return res.status(500).json({ msg: "Server error" });
    }
  } catch (error) {
    return res.json({ msg: "Server error", error: error.message });
  }
};

const getSchoolCallingStatus = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const getSchoolStatus = await DBMODELS.calling_team_status.findOne({
      where: {
        schoolId,
      },
    });
    return res.status(200).json({ msg: "Get successfully", getSchoolStatus });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAllreminder = async (req, res) => {
  const { id } = req.params;

  try {
    //     const query = `SELECT
    //     i.*,
    //     cts.reminder_status
    // FROM
    //     institutecbse_details i
    // JOIN
    //     calling_team_status cts ON i.id = cts.schoolId
    // JOIN
    //     data_provider dp ON cts.subAdminId = dp.subAdmin_Id
    // WHERE
    //     dp.state = i.state AND
    //     cts.subAdminId = ${id} AND
    //     cts.reminder_status IS NOT NULL AND
    //     cts.reminder_status <> ''
    // `;

    // const result = await sequelize.query(query, {
    //   replacements: { id },
    //   type: sequelize.QueryTypes.SELECT
    // });

    const getCallingStatusId = await DBMODELS.calling_team_status.findAll({
      where: {
        subAdminId: id,
        reminder_status: {
          [Op.not]: null,
          [Op.ne]: "",
        },
      },
      attributes: [
        "id",
        "schoolId",
        "reminder_status",
        [
          sequelize.literal(`
            (select affliate_number from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "affliate_number",
        ],
        [
          sequelize.literal(`
            (select institution_name from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "institution_name",
        ],
        [
          sequelize.literal(`
            (select address from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "address",
        ],
        [
          sequelize.literal(`
            (select state from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "state",
        ],
        [
          sequelize.literal(`
            (select email from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "email",
        ],
        [
          sequelize.literal(`
            (select contact from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "contact",
        ],
        [
          sequelize.literal(`
            (select pincode from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "pincode",
        ],
        [
          sequelize.literal(`
            (select stdcode from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "stdcode",
        ],
        [
          sequelize.literal(`
            (select createdAt    from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "createdAt",
        ],
      ],
      raw: true,
    });

    return res
      .status(200)
      .json({ msg: "getReminder", getReminderData: getCallingStatusId });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal sever", error: error.message });
  }
};
// getSubadminCallingStatus
const getCallingStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const getCallStatus = await DBMODELS.calling_team_status.findAll({
      where: {
        subAdminId: id,
      },
      attributes: [
        "call_status",
        "reminder_status",
        "detail_sent_status",
        "registration_status",
        [
          sequelize.literal(`
            (select institution_name from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "institution_name",
        ],
        [
          sequelize.literal(`
            (select email from institutecbse_details as i
              where i.id = calling_team_status.schoolId
            )`),
          "email",
        ],
      ],
    });
    return res.status(200).json({ msg: "Get calling status", getCallStatus });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
module.exports = {
  getUnderReviewInstitute,
  approveinstitute,
  rejectInstitute,
  getUnderReviewInstituteById,
  getSingleInstituteData,
  getInsituteDetail,
  approvedSinglInst,
  searchInstitute,
  getInsituteByDate,
  deleteSingleInstitute,
  getNipamData,
  allNipamWithDate,
  getNipamWithoutKv,
  getNipamWithoutKvDate,
  getNipamWithKv,
  getNipamWithKvDate,
  getSearchNipamData,
  cbseDataUpload,
  uploader,
  getAllCbseDetail,
  deleteCbseDetails,
  searchUnderReviewDataNew,
  getSingleCbseData,
  addSingleCbseAltData,
  addMultiCbseAltData, // Included from HEAD
  adminCommentsCreated,
  createAssignData,
  getSubadminData,
  getDataToSubadmin,
  getAssignData,
  getStateAssignedData,
  getAllStateName, // Included from nitesh
  getAllDistrictName, // Included from nitesh
  getAllAsignData,
  getBasedOnStateDistrict,
  getSingleSubadminData,
  getComments,
  schoolCallingStatus,
  getSchoolCallingStatus,
  editComments,
  getAllreminder,
  getCallingStatus,
};
