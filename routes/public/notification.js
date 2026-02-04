const { Op, Sequelize } = require("sequelize");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const { log } = require("handlebars/runtime");

const userType = ["student", "teacher", "both", "admin", "all"];
const notifyType = ["specific", "institute", "all"];

async function getNotify(req, res) {
  logg.info(req.user);
  const { role, id, instituteId } = req.user;
  try {
    let notify = [];
    logg.info(role);
    if (role) {
      notify = await DBMODELS.notification.findAll({
        where: {
          [Op.or]: [
            {
              [Op.or]: [
                { unique_id: id ?? 0, type: "specific" },
                { reference_id: instituteId ?? 0, type: "institute" },
              ],
              role,
            },
            {
              [Op.or]: [
                { role: "all", type: "all" },
                { role, type: "all" },
                {
                  role: role === "student" || role === "teacher" ? "both" : "-",
                  type: "all",
                },
              ],
            },
          ],
        },
        attributes: [
          "id",
          "heading",
          "desc",
          "subheading",
          "role",
          "seen",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
      });
      res.json({ notify });
    } else {
      return res.status(400).json({ message: "User type not found" });
    }
  } catch (error) {
    logg.error(error);
    res.status(500).json({ message: "Something went Wrong!!!" });
  }
}

async function getUsers(req, res) {
  const { role, type } = req.body;
  let userList = [];
  logg.info({ role, type });
  try {
    switch (role) {
      case "student":
      case "teacher":
      case "both":
        if (type === "specific") {
          userList = await DBMODELS.students.findAll({
            where: role ? { role } : {},
            attributes: [
              "id",
              [
                Sequelize.fn(
                  "concat",
                  Sequelize.col("first_name"),
                  " ",
                  Sequelize.col("last_name")
                ),
                "name",
              ],
              "instituteId",
            ],
          });
        } else if (type === "institute") {
          userList = await DBMODELS.institutions.findAll({
            attributes: ["id", ["institution_name", "name"], "first_name"],
          });
        }
        break;
      case "admin":
        userList = await DBMODELS.institutions.findAll({
          attributes: ["id", ["institution_name", "name"], "first_name"],
        });
        break;
    }
    res.json({ userList });
  } catch (error) {
    logg.error(error);
    res.status(500).json({ message: "Something went Wrong!!!" });
  }
}

async function addNotify(req, res) {
  const { type, role, users, heading, subHeading, desc } = req.body;
  try {
    if (type === "specific") {
      let userIdList = users?.flatMap((l) => l.id);
      logg.info(userIdList);
      userIdList?.map((l) => {
        DBMODELS.notification.create({
          role,
          type,
          unique_id: l,
          heading,
          subHeading,
          desc,
        });
      });
    } else if (type === "institute") {
      DBMODELS.notification.create({
        role,
        type,
        reference_id: users?.id,
        heading,
        subHeading,
        desc,
      });
    } else if (type === "all") {
      DBMODELS.notification.create({
        role,
        type,
        heading,
        subHeading,
        desc,
      });
    }
    res.json({ message: "Notification is Updated" });
  } catch (error) {
    logg.error(error);
    res.status(500).json({ message: "Something went Wrong!!!" });
  }
}

module.exports = { getNotify, getUsers, addNotify };
