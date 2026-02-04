const { uid } = require("uid");
const slugify = require("slugify");
const {
  InstitutionRegisterSchema,
  hashingPassword,
  checkHashedPass,
} = require("../auth/validation");
const sendEmailService = require("../../service/email");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
const newSlugify = require("../../middleware/newSlugify");

const userDetail = async (req, res) => {
  const { role, userId, instituteId } = req.params;
  try {
    const userDetail = await DBMODELS.students.findOne({
      where: {
        id: userId,
      },
      attributes: [
        "id",
        "first_name",
        "middle_name",
        "last_name",
        "bio",
        "father_name",
        "instituteId",
        "address",
        "state",
        "pincode",
        "email",
        "contact",
        "status",
        "district",
        "profile",
        "banner",
        "gender",
        "dob",
        "fb",
        "twitter",
        "insta",
        "ytb",
        "lkd",
        "permission",
        [
          sequelize.literal(`(
                    select institution_name 
                    from institutions as i
                    where i.id = students.instituteId
                )`),
          "institution_name",
        ],
      ],
    });
    return res.json({
      message: "successfully get data",
      result: userDetail,
    });
  } catch (error) {
    return res.json({
      message: "internal server error",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId, role } = req.params;
  const body = ({
    first_name,
    last_name,
    instituteId,
    address,
    contact,
    profile,
    gender,
    fb,
    twitter,
    insta,
    lkd,
    ytb,
  } = req.body);
  try {
    const user = await DBMODELS.students.findOne({
      where: {
        id: userId,
        role,
      },
    });
    if (user) {
      const user_reg_detail =
        role === "student"
          ? await DBMODELS.student_reg_details.findOne({
              where: {
                student_id: userId,
              },
            })
          : await DBMODELS.teacher_reg_details.findOne({
              where: {
                teacher_id: userId,
              },
            });

      const update = await DBMODELS.students.update(body, {
        where: {
          id: userId,
          role,
        },
      });

      return res.status(200).json({
        message: "successfully updated",
      });
    } else {
      return res.json({
        message: "User Not Found",
      });
    }
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const subscribe = async (req, res) => {
  const { email } = req.params;
  console.log("hey");
  try {
    const subscribe = await DBMODELS.user_subscriber.create({ email });
    if (subscribe) {
      let replacements = "";
      let mailConfig = {
        email: email,
        subject: `Thanks for Subscribing!`,
      };
      console.log("hey email");
      sendEmailService.sendTemplatedEmail(
        mailConfig,
        replacements,
        "Email_Subscription"
      );
      return res.json({
        message: "Succesfully subscribe",
      });
    }
    return res.json({
      message: "Internal server error",
    });
  } catch (error) {
    return res.json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const nipamCircular = async (req, res) => {
  const { email } = req.params;
  try {
    let replacements = "";
    let mailConfig = {
      email: email,
      subject: `Nipam Circular`,
    };
    console.log("hey email");
    sendEmailService.sendTemplatedEmail(
      mailConfig,
      replacements,
      "Nipam_Circular"
    );
    return res.json({
      message: "Successfully Emailed",
    });
  } catch (error) {
    return res.json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const unSubscribe = async (req, res) => {
  const { email } = req.params;
  try {
    const unsubscribe = await DBMODELS.user_subscriber.destroy({ email });
    if (unsubscribe) {
      return res.json({
        message: "Succesfully unsubscribe",
      });
    }
    return res.json({
      message: "Internal server error",
    });
  } catch (error) {
    return res.json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const searchDetails = async (req, res) => {
  const { searchQuery } = req.params;
  console.log(searchQuery);
  try {
    const blogs = await DBMODELS.blogs.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { heading: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      raw: true,
    });
    const news = await DBMODELS.news.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { heading: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      raw: true,
    });

    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: { blogs, news, count: blogs.length + news.length },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getArticle = async (req, res) => {
  try {
    const article = await DBMODELS.news.findAll({
      order: [["createdAt", "DESC"]],
      limit: 9,
    });
    if (article) {
      return res.status(200).json({ msg: "Get news", article });
    } else {
      return res.status(500).json({ msg: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const fetchStudentClass = async (req, res) => {
  const { userId, role } = req.params;

  if (role !== "student") {
    return res
      .status(400)
      .json({ message: "Invalid user type (Not a Student or Teacher)!!" });
  }

  try {
    const StudentClassDetail = await DBMODELS.students.findOne({
      where: {
        id: userId,
        role: role,
      },
      attributes: ["class"],
      raw: true,
    });
    if (StudentClassDetail) {
      return res.status(200).json({
        message: "Class Fetched Successfully!!",
        result: StudentClassDetail,
      });
    } else {
      return res
        .status(404)
        .json({ message: "An error occurred while fetching class!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStudentClass = async (req, res) => {
  const { userId, role } = req.params;
  const { classValue } = req.body;

  if (role !== "student") {
    return res
      .status(400)
      .json({ message: "Invalid user type (Not a Student)!!" });
  }

  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid student ID provided.",
    });
  }
  if (!classValue) {
    return res.status(400).json({
      message: "Invalid or missing class value.",
    });
  }
  try {
    const [updatedRows] = await DBMODELS.students.update(
      { class: classValue },
      { where: { id: userId, role: "student" } }
    );

    if (updatedRows > 0) {
      return res.status(200).json({
        message: "Class Updated Successfully!!",
      });
    } else {
      return res.status(404).json({
        message: "Student not found or no changes made.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};

module.exports = {
  userDetail,
  updateUserProfile,
  subscribe,
  searchDetails,
  getArticle,
  unSubscribe,
  nipamCircular,
  fetchStudentClass,
  updateStudentClass,
};
