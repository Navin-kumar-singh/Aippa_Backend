/*
  ========= Institute Event control ==============
  - Fetch/ Add / Delete  Event Data (Not in Use Currently)
  - Event Dead line check for institutes ( Working ) 
 */

const { QueryTypes, Op } = require("sequelize");
const sequelize = require("../../database/connection");
const g20_tracks = require("../../database/models/g20_tracks");
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");
const moment = require("moment");
const { emailDelegates } = require("./delegatesEmail");
function instituteEvent(req, res) {
  const instituteId = req.user.id;
  const { tracks, theme, designation, country } = req.body;
  if (tracks && theme && designation && country && instituteId) {
    mysqlcon.query(
      `INSERT INTO eventPlan(track,theme,designation,country,instituteId) VALUES 
        ('${JSON.stringify(tracks)}','${JSON.stringify(
        theme
      )}','${JSON.stringify(designation)}','${JSON.stringify(
        country
      )}','${instituteId}') 
        ON DUPLICATE KEY UPDATE track='${JSON.stringify(
        tracks
      )}',theme='${JSON.stringify(theme)}',designation='${JSON.stringify(
        designation
      )}',country='${JSON.stringify(country)}'`,
      function (err, result) {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error!!" });
        } else {
          if (result.affectedRows) {
            ///////Update isPlanned in instititude table////////
            try {
              DBMODELS.institutions.update(
                { isAssigned: "false", isPlanned: "true" },
                {
                  where: {
                    id: instituteId,
                  },
                }
              );
            } catch (err) {
              logg.error(err);
            }
            /********************************** */

            res
              .status(200)
              .json({ message: "Event Updated Successfully !", result });
          } else {
            res.status(200).json({ message: "Event Not Updated", result });
          }
        }
      }
    );
  } else {
    res.status(405).json({ message: "Data Missing!!" });
  }
}

function getEvent(req, res) {
  const instituteId = req.user.id;
  mysqlcon.query(
    `SELECT * FROM eventPlan WHERE instituteId=${instituteId}`,
    function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error!!" });
      } else {
        res.status(200).json({ result });
      }
    }
  );
}

async function deleteEvent(req, res) {
  const instituteId = req.user.id;
  try {
    const deleteEvent = await DBMODELS.eventPlan.destroy({
      where: {
        instituteId,
      },
    });

    const updateInstitute = await DBMODELS.institutions.update(
      { isAssigned: "false", isPlanned: "false" },
      {
        where: {
          id: instituteId,
        },
      }
    );

    const updateDelegagets = await DBMODELS.g20_delegates.update(
      { track: null, theme: null, cntry: null, desig: null },
      {
        where: {
          instituteId,
        },
      }
    );

    res.status(200).json({
      message: "Event Deleted Successfully!",
      deleteEvent,
      updateInstitute,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Event Not Deleted" });
  }
}

async function EventFormData(req, res) {
  try {
    var [result] = await sequelize.query("SELECT id,name FROM g20_tracks");
    const tracks = result;
    var [result] = await sequelize.query("SELECT name FROM g20_themes");
    const themes = result;
    var [result] = await sequelize.query(
      "SELECT name,track_id FROM g20_designation"
    );
    const designations = result;
    var [result] = await sequelize.query("SELECT name FROM g20_country");
    const countrys = result;

    res.status(200).json({ tracks, themes, designations, countrys });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });

    throw err;
  }
}

const eventDeadlinesChecker = async () => {
  const institutes = await DBMODELS.institute_onboard.findAll({
    where: {
      appointment_date: {
        [Op.ne]: null,
      },
      deadline: {
        [Op.ne]: null,
      },
      instituteId: {
        [Op.ne]: null,
      },
    },
    attributes: ["instituteId", "appointment_date", "deadline"],
    raw: true,
  });
  institutes.forEach(async (institute, index) => {
    const event_Date = moment(institute?.appointment_date).add(1, 'd').format('YYYY-MM-DD');
    const instituteId = institute?.instituteId;
    const deadline_Date = moment(institute?.deadline).format("YYYY-MM-DD");
    // Date Checks
    const todayDate = moment().format("YYYY-MM-DD");
    const checkDeadlineDate = moment(deadline_Date).isSame(todayDate);
    const eventDateCheck = moment(event_Date).isSame(todayDate);
    if (checkDeadlineDate) {
      const DelegateStudents = await DBMODELS.g20_delegates.count({
        where: {
          instituteId,
        },
      });
      if (DelegateStudents < 20) {
        const newDeadline = moment().add(2, "d").format("YYYY-MM-DD");
        // DBMODELS.institute_onboard.update()
        DBMODELS.institute_onboard.update(
          {
            deadline: newDeadline,
          },
          {
            where: {
              instituteId,
            },
          }
        );
      }
    } else {
      // students mail send
      const delegaetsList = await sequelize.query(
        `SELECT delg.cntry, delg.desig ,delg.theme,stds.first_name,stds.email,inst.institution_name FROM g20_delegates AS delg 
        LEFT JOIN students AS stds 
        ON stds.id=delg.studentId
        LEFT JOIN institutions AS inst
        ON inst.id=delg.instituteId 
        WHERE delg.instituteId=${instituteId}`,
        {
          raw: true,
          type: QueryTypes.SELECT,
        }
      );
      emailDelegates(delegaetsList);
    }
    if (eventDateCheck) {
      const DelegateStudents = await DBMODELS.g20_delegates.count({
        where: {
          instituteId,
        },
      });
      if (DelegateStudents < 20) {
        const newDeadlineDate = moment().add(2, "d").format("YYYY-MM-DD");
        const newEventDate = moment().add(3, "d").format("YYYY-MM-DD");
        DBMODELS.institute_onboard.update(
          {
            appointment_date: newEventDate,
            deadline: newDeadlineDate,
          },
          {
            where: {
              instituteId,
            },
          }
        );
      }
    }
  });
};
module.exports = {
  instituteEvent,
  getEvent,
  deleteEvent,
  EventFormData,
  eventDeadlinesChecker,
};
