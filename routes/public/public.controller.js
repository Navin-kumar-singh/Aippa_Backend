/*
Public functionalities using for public functionalities
- get institute Data for Public use
- get g20 Countries
- get G20 Designations
- get topics for G20
- get data like state state, area, postoffice etc by state
- get districts by state
- get data like youtube video or other contents by State
- add data like youtube video or other contents by State
- add contact Us Data by publci contact us form
- get student profile data for public page like for Forum

*/

const {where, QueryTypes, Op, Sequelize} = require("sequelize");
const sequelize = require("../../database/connection");
const {DBMODELS} = require("../../database/models/init-models");
const {mysqlcon} = require("../../model/db");
const logg = require("../../utils/utils");

async function getPublicInstitute(req, res) {
  const {collegeId, slug} = req.query;
  if (collegeId) {
    try {
      sql = `SELECT * FROM institutions WHERE id=${collegeId} AND status='active'`;
      mysqlcon.query(sql, function (err, result) {
        if (err) {
          return res.status(500).json({message: "Internal Server Error"});
        } else {
          return res
            .status(200)
            .json({message: "Institute Fetched Successfully", result});
        }
      });
    } catch (error) {
      logg.error(error);
    }
  } else if (slug) {
    try {
      sql = `SELECT * FROM institutions WHERE slug=${slug}  AND status='active'`;
      mysqlcon.query(sql, function (err, result) {
        if (err) {
          logg.error(err);
          res.status(500).json({message: "Internal Server Error"});
        } else if (result[0]?.status !== "active") {
          res.status(404).json({message: "Institute Not Found"});
        } else if (!result.length) {
          res.status(404).json({message: "Institute Not Found"});
        } else {
          res
            .status(200)
            .json({message: "Institute Fetched Successfully", result});
        }
      });
    } catch (error) {
      logg.error(error);
    }
  } else {
    res.status(404).json({message: "Institute Not Found"});
  }
}
async function fetchAllG20Countries(req, res) {
  mysqlcon.query(`SELECT * FROM g20_country WHERE 1`, function (err, result) {
    if (err) {
      logg.error(err);
      res.status(500).json({message: "Internal Server Error"});
    } else {
      res
        .status(200)
        .json({message: "Fetched Countries Successfully", result});
    }
  });
}
async function fetchAllG20Designation(req, res) {
  mysqlcon.query(
    `SELECT * FROM g20_designation WHERE 1`,
    function (err, result) {
      if (err) {
        logg.error(err);
        res.status(500).json({message: "Internal Server Error"});
      } else {
        res
          .status(200)
          .json({message: "Fetched Countries Successfully", result});
      }
    }
  );
}
async function fetchTrackAndTheme(req, res) {
  try {
    const tracks = await DBMODELS.g20_tracks.findAll();
    const themes = await DBMODELS.topics.findAll({
      include: {
        model: DBMODELS.sub_topics,
        as: "sub_topics"
      }
    })
    res.status(200).json({
      tracks, themes
    });
  } catch (error) {
    res.status(500).json({message: "something went wrong"})
  }
}
async function fetchTopics(req, res) {
  mysqlcon.query(`SELECT * FROM topics WHERE 1`, async function (err, result) {
    if (err) {
      logg.error(err);
      res.status(500).json({message: "Internal Server Error"});
    } else {
      const topics = result;
      let responseArray = [];
      function sendResponse() {
        if (topics.length === responseArray.length) {
          res.status(200).json({
            message: "Fetched Topics Successfully",
            result: responseArray,
          });
        }
      }
      for (let i = 0; i < topics.length; i++) {
        mysqlcon.query(
          `SELECT * FROM sub_topics WHERE topicId=${topics[i].id} ORDER BY id ASC`,
          function (err, result) {
            if (err) {
              logg.error(err);
              res.status(500).json({message: "Internal Server Error"});
            } else {
              responseArray.push({
                ...topics[i],
                sub_topics: result,
              });
              sendResponse();
            }
          }
        );
      }
    }
  });
}
async function stateWiseData(req, res) {
  const {data, State, District, Pincode, City, PostOfficeName} = req.query;
  const sql = `SELECT DISTINCT ${data} FROM pincode ${State || District || Pincode || City || PostOfficeName ? "WHERE" : ""
    } ${State && `State="${State}"`} 
  ${District && `${State && "AND"} District="${District}"`} 
  ${Pincode && `  ${State || District ? "AND" : ""} Pincode="${Pincode}"`} 
  ${City && `${State || District || Pincode ? "AND" : ""} City="${City}"`} 
  ${PostOfficeName &&
    `${State || District || Pincode || City ? "AND" : ""
    } PostOfficeName="${PostOfficeName}"`
    }`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res
        .status(500)
        .json({query: sql, error: err, message: "Internal Server Error"});
    } else {
      res.status(200).json({
        query: sql,
        message: "Fetched result Successfully",
        data: result,
      });
    }
  });
}
async function stateAndDistrictData(req, res) {
  const sql = `SELECT DISTINCT state FROM pincode ORDER BY state`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res
        .status(500)
        .json({query: sql, error: err, message: "Internal Server Error"});
    } else {
      const states = result;
      let resultState = [];
      const sendResponse = () => {
        if (states.length === resultState.length) {
          res.status(200).json({
            message: "Fetched result Successfully",
            data: resultState,
          });
        }
      };
      states.forEach((state, stateIndex) => {
        mysqlcon.query(
          `SELECT DISTINCT district FROM pincode WHERE state='${state.state}'`,
          async function (err, result) {
            if (err) {
              logg.error(err);
              res.status(500).json({
                query: sql,
                error: err,
                message: "Internal Server Error",
              });
            } else {
              await resultState.push({
                ...state,
                District: result,
              });
              sendResponse();
            }
          }
        );
      });
    }
  });
}
async function stateWiseContent(req, res) {
  const {slug} = req.query;
  sequelize
    .query(
      `SELECT stateWiseContent.* FROM stateWiseContent 
  LEFT JOIN institutions ON stateWiseContent.state COLLATE utf8mb4_general_ci = institutions.state 
  WHERE institutions.slug=${slug}`
    )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((error) => {
      res.status(417).json(error);
    });
}

function StatesList(req, res) {
  DBMODELS.pincode
    .findAll({
      raw: true,
      attributes: [[Sequelize.literal("DISTINCT `state`"), "state"], "state"],
    })
    .then((states) => {
      res.json({states});
    })
    .catch((error) => {
      logg.error(error);
      res.status(500);
    });
}
function DistrictList(req, res) {
  const {state} = req.query;
  DBMODELS.pincode
    .findAll({
      raw: true,
      attributes: [
        [Sequelize.literal("DISTINCT `district`"), "district"],
        "district",
      ],
      where: {state},
    })
    .then((district) => {
      res.json({district});
    })
    .catch((error) => {
      logg.error(error);
      res.status(500);
    });
}

async function stateAndDistrictData(req, res) {
  const sql = `SELECT DISTINCT state FROM pincode ORDER BY state`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      logg.error(err);
      res
        .status(500)
        .json({query: sql, error: err, message: "Internal Server Error"});
    } else {
      const states = result;
      let resultState = [];
      const sendResponse = () => {
        if (states.length === resultState.length) {
          res?.json({
            message: "Fetched result Successfully",
            data: resultState,
          });
        }
      };
      states.forEach(async (state, stateIndex) => {
        const stateDistrict = await sequelize.query(
          `SELECT DISTINCT district FROM pincode WHERE state='${state.state}' ORDER BY district `,
          {type: QueryTypes.SELECT, raw: true}
        );
        if (stateDistrict) {
          resultState[stateIndex] = {
            ...state,
            District: stateDistrict,
          };
          if (
            states.length === resultState.length &&
            stateIndex === states.length - 1
          ) {
            res?.json({
              message: "Fetched result Successfully",
              data: resultState,
            });
          }
        }
      });
    }
  });
}
async function fetchStateWiseContent(req, res) {
  DBMODELS.stateWiseContent
    .findAll({
      raw: true,
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      logg.error(error);
      res.status(417).json(error);
    });
}
async function uploadStateWiseContent(req, res) {
  const {state} = req.query;
  var data = {};
  const {qoute, qouteBy, link} = req.body;
  if ((qoute && qouteBy) || link) {
    if (qoute && qouteBy && link) {
      data = {qoute, qouteBy, link};
    } else if (qoute && qouteBy) {
      data = {qoute, qouteBy};
    } else {
      data = {link};
    }

    DBMODELS.stateWiseContent
      .update(data, {
        where: {state},
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        logg.error(error);
        res.status(417).json(error);
      });
  } else {
    res.status(404).json({message: "Data Not Found!"});
  }
}
async function contactUs(req, res) {
  const {full_name, contact, email, message, subject, type} = req.body;
  if (type === "newsletter") {
    if (email) {
      try {
        const contact_respond = DBMODELS.contactus.create({
          email,
          subject: "NEWSLETTER",
        });
        if (contact_respond) {
          res.json({status: "success", message: "Thank You!"});
        }
      } catch (error) {
        logg.error(error);
        res.json({status: "error", message: "Internal Server Error"});
      }
    } else {
      res.json({status: "warning", message: "Please fill all fields"});
    }
  } else {
    if (full_name && contact && email && message && subject) {
      try {
        const contact_respond = DBMODELS.contactus.create({
          full_name,
          contact,
          email,
          message,
          subject,
        });
        if (contact_respond) {
          res.json({
            status: "success",
            message:
              "Thank Your for your response, Your Message Sent Successfully",
          });
        }
      } catch (error) {
        logg.error(error);
        res.json({status: "error", message: "Internal Server Error"});
      }
    } else {
      res.json({status: "warning", message: "Please fill all fields"});
    }
  }
}

async function StudentsPublic(req, res) {
  const {id} = req.query;
  sequelize
    .query(
      `SELECT  
    s.id, 
    s.profile, 
    s.first_name,
    s.last_name, 
    s.email,
    s.instituteId, 
    i.institution_name,
    c.courseId,
    c.img,
    c.certificate_key,
    c.createdAt,
    COUNT(c.studentId) AS course_count,
    co.course_name
FROM students AS s
LEFT JOIN institutions AS i ON s.instituteId = i.id
LEFT JOIN certificates AS c ON s.id = c.studentId
LEFT JOIN courses AS co ON c.courseId = co.id
WHERE s.id = ${id}
GROUP BY s.id, i.institution_name, c.courseId, co.course_name
ORDER BY s.id, c.courseId;`
    )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      logg.error(error);
      res.status(500).json("Internal Server Error");
    });
}
// Fetch Institutes
const fetchInstituteList = async (req, res) => {
  try {
    const result = await DBMODELS.institutions.findAll({
      attributes: [
        ["id", "value"],
        ["institution_name", "label"],
        ["logo", "icon"],
      ],
    });
    return res.json({
      status: "success",
      message: "Institute List Fetched",
      result,
    });
  } catch (error) {
    logg.error(error);
    return res.json({
      status: "error",
      message: "Error While Fetching Institutes",
    });
  }
};
module.exports = {
  getPublicInstitute,
  fetchAllG20Countries,
  fetchAllG20Designation,
  stateWiseContent,
  stateWiseData,
  fetchTopics,
  fetchTrackAndTheme,
  stateAndDistrictData,
  uploadStateWiseContent,
  fetchStateWiseContent,
  contactUs,
  StudentsPublic,
  fetchInstituteList,
  StatesList,
  DistrictList,
};