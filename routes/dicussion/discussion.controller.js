const {QueryTypes, Sequelize} = require("sequelize");
const sequelize = require("../../database/connection");
const {DBMODELS} = require("../../database/models/init-models");
const logg = require("../../utils/utils");

async function fetchDiscussionPoints(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  const {roomId, sort, sort_attr} = req.query;
  let result = [];
  if (roomId && userId) {
    if (userType == 0) {
      result = await sequelize.query(
        `SELECT EV.*,
                STD.profile,STD.id AS userId,STD.instituteId,STD.first_name,
                GDEL.track,GDEL.theme,GDEL.cntry,GDEL.desig,
                GCOU.flag_icon AS flag
                FROM event_point as EV 
                LEFT JOIN students AS STD 
                ON EV.userId=STD.id
                LEFT JOIN g20_delegates AS GDEL
                ON GDEL.studentId=EV.userId
                LEFT JOIN g20_country AS GCOU
                ON GCOU.name=GDEL.cntry
                WHERE EV.roomId='${roomId}'
                ORDER BY createdAt DESC`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json({message: "Data Fetched Succesfully", result});
    } else if (userType == 1) {
      result = await sequelize.query(
        `SELECT EV.id,EV.text,EV.roomId,EV.userId,EV.track,EV.theme,EV.createdAt,EV.updatedAt,EV.report,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="up") AS upvote,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="down") AS downvote,
        STD.profile,STD.id AS userId,STD.instituteId,STD.first_name,
        GDEL.track,GDEL.theme,GDEL.cntry,GDEL.desig,
        GCOU.flag_icon AS flag
        FROM event_point as EV 
        LEFT JOIN students AS STD 
        ON EV.userId=STD.id
        LEFT JOIN g20_delegates AS GDEL
        ON GDEL.studentId=EV.userId
        LEFT JOIN g20_country AS GCOU
        ON GCOU.name=GDEL.cntry
        WHERE EV.roomId='${roomId}'
        ORDER BY createdAt DESC`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json({message: "Data Fetched Succesfully", result});
    } else {
      res.json({status: "WARNING", message: "User Not Found"});
    }
  } else {
    res.json({status: "ERROR", message: "Data Not Found"});
  }
}
async function fetchLeaderBoard(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  const {roomId, limit} = req.query;
  let result = [];
  // ? FOR ONLY INSTITUTE ==================
  if (roomId && userId) {
    if (userType == 1) {
      result = await sequelize.query(
        `SELECT EV.*,
        GDEL.track,GDEL.theme,GDEL.cntry,GDEL.desig,
        GCOU.flag_icon AS flag,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="up") AS upvote,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="down") AS downvote,
        STD.profile,STD.id AS userId,STD.instituteId,STD.first_name
        FROM event_point as EV 
        LEFT JOIN students AS STD 
        ON EV.userId=STD.id
        LEFT JOIN g20_delegates AS GDEL
        ON GDEL.studentId=EV.userId
        LEFT JOIN g20_country AS GCOU
        ON GCOU.name=GDEL.cntry
        WHERE EV.roomId='${roomId}'
        ORDER BY upvote DESC, downvote ASC,createdAt DESC
        LIMIT ${limit ? limit : 30}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res
        .status(200)
        .json({message: "Leaderboard Fetched Succesfully", result});
    } else {
      res.json({status: "WARNING", message: "Data Not Found"});
    }
  } else {
    res.json({status: "Error", message: "Invalid Request"});
  }
}
async function fetchDeclarationLeaderBoard(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  const {roomId, limit, instituteId} = req.body;
  let result = [];
  // ? FOR ONLY INSTITUTE ==================
  if (roomId && userId) {
    if (userType == 1 || userType == 0) {
      result = await sequelize.query(
        `SELECT EV.id,EV.text,EV.roomId,EV.userId,EV.track,EV.theme,EV.createdAt,EV.updatedAt,EV.report,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="up") AS upvote,
        (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="down") AS downvote,
        STD.profile,STD.id AS userId,STD.instituteId,STD.first_name,
        GDEL.track,GDEL.theme,GDEL.cntry,GDEL.desig,
        GCOU.flag_icon AS flag
        FROM event_point AS EV 
        LEFT JOIN event_status as EVS
        ON EVS.relMeetingId=EV.roomId
        LEFT JOIN students AS STD 
        ON EV.userId=STD.id
        LEFT JOIN g20_delegates AS GDEL
        ON GDEL.studentId=EV.userId
        LEFT JOIN g20_country AS GCOU
        ON GCOU.name=GDEL.cntry
        WHERE EVS.id='${roomId}'
        ORDER BY upvote DESC, downvote ASC,createdAt DESC
        LIMIT ${limit ? limit : 10}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res
        .status(200)
        .json({message: "Leaderboard Fetched Succesfully", result});
    } else {
      res.json({status: "WARNING", message: "Data Not Found"});
    }
  } else {
    res.json({status: "Error", message: "Invalid Request"});
  }
}
async function instituteStatusUpdater(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  const body = req.body;
  if (Number(userType) === 1 && body?.status && body?.meetingId) {
    if (body.status === "pause") {
      await DBMODELS.event_status.update(
        {
          meeting_status: "pause",
        },
        {
          where: {
            instituteId: body?.instituteId,
            id: body?.meetingId,
          },
        }
      );
      res.json({status: "SUCCESS", message: "Meeting Paused"});
    } else if (body.status === "end") {
      await DBMODELS.event_status.update(
        {
          meeting_status: "end",
        },
        {
          where: {
            instituteId: body?.instituteId,
            id: body?.meetingId,
          },
        }
      );
      res.json({status: "SUCCESS", message: "Meeting has been Ended"});
    } else if (body.status === "started") {
      await DBMODELS.event_status.update(
        {
          meeting_status: "Started",
        },
        {
          where: {
            instituteId: body?.instituteId,
            id: body?.meetingId,
          },
        }
      );
      res.json({status: "SUCCESS", message: "Meeting Started"});
    }
  } else {
    res.json({status: "ERROR", message: "Invalid Request", user: req.user});
  }
}
async function instituteStatusChecker(req, res) {
  const body = req.body;
  const findMeeting = await DBMODELS.event_status.findOne({
    where: {
      instituteId: body?.instituteId,
      track: body?.track,
    },
  });
  if (findMeeting) {
    res.json({
      status: "SUCCESS",
      message: "Current Status of track",
      meeting_status: findMeeting,
    });
  } else {
    res.json({
      status: "NOT FOUND",
      message: "Status Not Found",
      meeting_status: null,
    });
  }
}
async function instituteFindMeetings(req, res) {
  const body = req.body;
  if (body?.instituteId) {
    if (body?.track && body.type == "all") {
      const findMeetings = await DBMODELS.event_status.findAll({
        where: {
          instituteId: body?.instituteId,
          track: body?.track,
        },
      });
      res.json({
        status: "SUCCESS",
        message: "Current Status of track",
        result: findMeetings,
      });
    } else if (body?.meetingId && body.type == "single") {
      const findMeetings = await DBMODELS.event_status.findOne({
        where: {
          id: body?.meetingId,
        },
      });
      res.json({
        status: "SUCCESS",
        message: "Current Status of track",
        result: findMeetings,
      });
    } else if (body.type == "all") {
      const findMeetings = await DBMODELS.event_status.findAll({
        where: {
          instituteId: body?.instituteId,
        },
        order: [
          [sequelize.literal("track"), "ASC"],
          [sequelize.literal("meetingtype"), "ASC"],
        ],
      });
      res.json({
        status: "SUCCESS",
        message: "Current Status of track",
        result: findMeetings,
      });
    } else {
      res.json({status: "ERROR", message: "No Meetings Found"});
    }
  } else {
    res.json({status: "ERROR", message: "Invalid Request"});
  }
}
async function instituteEventStart(req, res) {
  const body = req.body;
  const checkPrevious = await DBMODELS.event_status.findOne({
    where: {
      track: body?.roomId,
      instituteId: body?.instituteId,
    },
  });
  if (!checkPrevious) {
    const newMeeting = await DBMODELS.event_status.create({
      instituteId: body?.instituteId,
      startTime: Sequelize.literal("CURRENT_TIMESTAMP"),
      track: body?.track,
      meetingtype: body?.type ? body?.type : "resoluttion",
      theme: body?.theme,
    });
    res.json({
      status: "SUCCESS",
      message: "Starting The Event",
      result: newMeeting,
    });
  } else {
    res.json({
      status: "CONFLICT",
      message: "Event Already Started",
      result: checkPrevious,
    });
  }
}
async function instituteDeclarationEventStart(req, res) {
  const body = req.body;
  if (body?.id && body?.instituteId && body?.track && body?.theme) {
    const checkPrevious = await DBMODELS.event_status.findOne({
      where: {
        id: body?.id,
        instituteId: body?.instituteId,
      },
    });
    const checkDecalared = await DBMODELS.event_status.findOne({
      where: {
        relMeetingId: body?.id,
        instituteId: body?.instituteId,
      },
    });
    if (checkDecalared) {
      res.json({
        status: "CONFLICT",
        message: "Declaration Meeting Already Scheduled",
      });
    } else if (checkPrevious) {
      const newMeeting = await DBMODELS.event_status.create({
        instituteId: body?.instituteId,
        relMeetingId: body?.id,
        startTime: Sequelize.literal("CURRENT_TIMESTAMP"),
        track: body?.track,
        meetingtype: "declaration",
        theme: body?.theme,
      });
      res.json({
        status: "SUCCESS",
        message: "Starting The Event",
        result: newMeeting,
      });
    } else {
      res.json({
        status: "NOT FOUND",
        message: "Resolution Meeting Not Found",
      });
    }
  } else {
    res.json({status: "ERROR", message: "Invalid Request"});
  }
}
async function DiscussionVotesController(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  const {pointId, type, meetingType} = req.body;
  console.log(req.body);
  // ? FOR ONLY STUDENTS ==================
  if (pointId && type) {
    if (Number(userType) === 0) {
      let CanVote = 1;
      if (meetingType == "declaration") {
        CanVote = 2;
      }
      const VoteCount = await DBMODELS.event_vote.count({
        where: {
          point_id: pointId, studentId: userId
        }
      })
      logg.success({VoteCount, CanVote, meetingType})
      if (VoteCount < CanVote) {
        const AddVote = await DBMODELS.event_vote.create(
          {vote: type, point_id: pointId, studentId: userId},
          {
            raw: true,
          }
        );
        if (AddVote) {
          if (type == "up") {
            const UpdateVote = await DBMODELS.event_point.increment(["upvote"], {
              where: {
                id: pointId,
              },
            });
          } else {
            const UpdateVote = await DBMODELS.event_point.increment(
              ["downvote"],
              {
                where: {
                  id: pointId,
                },
              }
            );
          }
        }
      }
      res
        .status(200)
        .json({message: "Voted Successfully"});
    } else {
      res.status(403).json({message: "Method Not Allowed"});
    }
  } else {
    res.status(404).json("Data Not Found! Please try Again Later");
  }
}
async function fetchSelfVotes(req, res) {
  const userId = req.user.id;
  const userType = req.user.type;
  if (userType == 0) {
    let result = await DBMODELS.event_vote.findAll({
      where: {
        studentId: userId,
      },
    });
    const responseArr = result.map((item, i) => {
      return item.point_id;
    });
    res
      .status(200)
      .json({message: "Fetched Successfully", result: responseArr});
  }
}
async function checkIsAssigned(req, res) {
  userId = req.user.id;
  userType = req.user.type;
  const body = req.body;
  if (Number(userType) === 1) {
    const check = await DBMODELS.institutions.findOne({
      where: {
        id: body?.instituteId,
        isAssigned: "true",
        isPlanned: "true",
      },
    });
    if (check) {
      res.json({
        status: "SUCCESS",
        message: "fetched assigned Status",
        result: true,
      });
    } else {
      res.json({
        status: "SUCCESS",
        message: "fetched assigned Status",
        result: false,
      });
    }
  }
}

/*  fetch Communique for yuvamanthan lite  */
async function fetchCommunique(req, res) {
  const instituteId = req?.body?.instituteId;
  tracks = ["YMG20 Lite"];
  const meetCount = await DBMODELS.event_status.count({
    where: {
      meetingtype: "declaration",
      meeting_status: "end",
      instituteId,
    },
  });
  const meetings = await sequelize.query(
    `SELECT ep.text,ep.theme,evs.track,evs.theme,evs.endTime,evs.meeting_status 
        FROM event_status AS evs
        LEFT JOIN event_point AS ep
        ON ep.roomId=evs.relMeetingId
        WHERE evs.instituteId=${instituteId} AND evs.meetingtype="declaration" AND evs.meeting_status="end"`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const instituteData = await DBMODELS.institutions.findOne({
    where: {
      id: instituteId,
    },
    attributes: [
      "institution_name",
      "institution_address",
      "state",
      "pincode",
      "logo",
      "first_name",
      "last_name",
      "email",
      "contact",
    ],
  });
  tracks = await tracks.map((track) => {
    let pointsArr = [];
    meetings.forEach((meeting, index) => {
      if (meeting.track === track && meeting.track) {
        pointsArr.push(meeting.text);
      }
    });
    return {track_name: track, points: pointsArr};
  });
  const delegates = await sequelize.query(
    `SELECT stud.first_name,stud.last_name,stud.contact,
            g20D.track,g20D.cntry as country,g20D.desig AS designation,g20D.theme FROM g20_delegates AS g20D
            LEFT JOIN students as stud
            ON stud.id=g20D.studentId 
            WHERE g20D.instituteId=${instituteId} AND stud.first_name IS NOT NULL`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const eligible = meetCount == tracks.length;
  if (eligible) {
    res.json({
      status: "SUCCESS",
      message: "Communique Document Created Successfully",
      result: {
        institute: {
          institute: instituteData?.institution_name,
          logo: instituteData?.logo,
          address:
            instituteData?.institution_address +
            ", " +
            instituteData?.state +
            ", " +
            instituteData?.pincode,
          name: instituteData?.first_name + " " + instituteData?.last_name,
          phone: instituteData?.contact,
          email: instituteData?.email,
        },
        tracks,
        participants: delegates,
      },
    });
  } else {
    res.json({
      status: "WARNING",
      message:
        "Communique Document is available only after end of all declaration meetings",
    });
  }
}
async function fetchCommuniqueReport(req, res) {
  try {
    const {instituteId, meetingId} = req?.body;
    if (instituteId && meetingId) {
      const meeting = await DBMODELS.event_status.findOne({
        where: {
          instituteId,
          id: meetingId,
          meeting_status: "end"
        }
      })
      const instituteData = await DBMODELS.institutions.findOne({
        where: {
          id: instituteId,
        },
        attributes: [
          "institution_name",
          "institution_address",
          "state",
          "pincode",
          "logo",
          "first_name",
          "last_name",
          "email",
          "contact",
        ],
      });
      const participants = await sequelize.query(
        `SELECT stud.first_name,stud.last_name,stud.contact,
              g20D.track,g20D.cntry as country,g20D.desig AS designation,g20D.theme,g20_tracks.name as track FROM g20_delegates AS g20D
              LEFT JOIN students as stud
              ON stud.id=g20D.studentId
              LEFT JOIN g20_designation
              ON g20_designation.name=g20D.desig
              LEFT JOIN g20_tracks
              ON g20_designation.track_id=g20_tracks.id
              WHERE g20D.instituteId=${instituteId} AND g20_tracks.name='${meeting.track}' AND stud.first_name IS NOT NULL`,
        {
          type: QueryTypes.SELECT,
        }
      );
      // const discussionPoints=await DBMODELS.event_point
      const discussionPoints = await sequelize.query(
                `SELECT EV.id,EV.text,EV.roomId,EV.userId,EV.track,EV.theme,EV.createdAt,EV.updatedAt,EV.report,
                (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="up") AS upvote,
                (SELECT COUNT(event_vote.id) FROM event_vote WHERE event_vote.point_id=EV.id AND vote="down") AS downvote,
                STD.profile,STD.id AS userId,STD.instituteId,STD.first_name,
                GDEL.track,GDEL.theme,GDEL.cntry,GDEL.desig,
                GCOU.flag_icon AS flag
                FROM event_point as EV 
                LEFT JOIN students AS STD 
                ON EV.userId=STD.id
                LEFT JOIN g20_delegates AS GDEL
                ON GDEL.studentId=EV.userId
                LEFT JOIN g20_country AS GCOU
                ON GCOU.name=GDEL.cntry
                WHERE EV.roomId='${meeting?.relMeetingId}'
                ORDER BY upvote DESC, downvote ASC,createdAt DESC
                LIMIT 10`,
        {
          type: QueryTypes.SELECT,
        });
      console.log(meeting, instituteData, participants);
      let address = instituteData?.institution_address + ", " + instituteData?.state + ", " + instituteData?.pincode
      return res.json({
        status: "SUCCESS",
        message: "Communique Report Fetched Successfully",
        result: {
          institute: {
            institute: instituteData?.institution_name,
            logo: instituteData?.logo,
            address,
            name: instituteData?.first_name + " " + instituteData?.last_name,
            phone: instituteData?.contact,
            email: instituteData?.email,
          },
          meeting,
          participants,
          discussionPoints
        },
      });
    } else {
      return res.json({
        status: "WARNING",
        message: "Invalid Data Please try again later",
      });
    }
  } catch (err) {
    console.log(err)
    return res.json({
      status: "WARNING",
      message: "Oops Something went wrong please try again later",
    });
  }
}
async function deleteMeeting(id, cb) {
  if (id) {
    try {
      DBMODELS.event_status
        .findAll({where: {id}, raw: true})
        .then(([room]) => {
          if (room) {
            DBMODELS.event_point
              .findAll({where: {roomId: room?.id}, raw: true})
              .then((points) => {
                points?.map((point) => {
                  DBMODELS.event_vote.destroy({
                    where: {point_id: point?.id},
                  });
                });
              })
              .finally(() => {
                DBMODELS.event_point.destroy({where: {roomId: room?.id}});
              });
          }
        })
        .finally(() => {
          DBMODELS.event_status.destroy({where: {id}});
        });
    } catch (err) {
      logg.error(err);
    }
  }
}
async function instituteEventDelete(req, res) {
  const {id, meetingtype, instituteId, theme} = req.body;
  try {
    if ((id, meetingtype, instituteId, theme)) {
      if (meetingtype === "track") {
        const [declaration] = await DBMODELS.event_status.findAll({
          where: {
            instituteId,
            relMeetingId: id,
            meetingtype: "declaration",
          },
          raw: true,
        });
        deleteMeeting(id);
        if (declaration) {
          deleteMeeting(declaration?.id);
        }
        res.json({status: 200, message: "Working"});
      } else {
        deleteMeeting(id);
        res.json({status: 200, message: "Working"});
      }
    } else {
      res.json({status: 404, message: "DATA NOT FOUND"});
    }
  } catch (err) {
    logg.error(err);
    return res.json({message: "NOT Working"});
  }
}
async function editStudentPoint(req, res) {
  const {id, userId, roomId, point} = req.body;
  if (id && userId && roomId && point) {
    DBMODELS.event_point
      .update(
        {
          text: point,
        },
        {
          where: {
            id,
            roomId,
            userId,
          },
        }
      )
      .then(() => {
        res.json({status: 200, message: "Updated."});
      })
      .catch((err) => {
        res.json({status: 500, message: "Something went Wrong!"});
      });
  } else {
    res.json({status: 404, message: "Data Not Fount!"});
  }
}
async function deleteStudentPoint(req, res) {
  const {id, userId, roomId} = req.body;
  if (id && userId && roomId) {
    DBMODELS.event_point
      .destroy({
        where: {id, userId, roomId},
      })
      .then(() => {
        res.json({status: 200, message: "Deleted."});
      })
      .catch((err) => {
        console.error(err);
        res.json({status: 500, message: "Something Went wrong!"});
      });
  } else {
    res.json({status: 404, message: "Data Not Fount!"});
  }
}
async function reportStudentPoint(req, res) {
  let temp = [];
  const {id, reportUserId, roomId} = req.body;
  if (id && reportUserId && roomId) {
    const [{report}] = await DBMODELS.event_point.findAll({
      where: {id, roomId},
      raw: true,
    });
    const result = report ? JSON.parse(report) : [];
    if (!result) {
      temp = [reportUserId];
    } else if (!result?.includes(reportUserId)) {
      temp = [...result, reportUserId];
    } else {
      return res.json({status: 208, message: "Already Reported!"});
    }
    DBMODELS.event_point
      .update(
        {
          report: JSON.stringify(temp),
        },
        {
          where: {id, roomId},
        }
      )
      .then(() => {
        res.json({status: 200, message: "Reported."});
      })
      .catch((err) => {
        console.error(err);
        res.json({status: 500, message: "Something Went wrong!"});
      });
  } else {
    res.json({status: 404, message: "Data Not Fount!"});
  }
}
module.exports = {
  fetchDiscussionPoints,
  DiscussionVotesController,
  instituteStatusUpdater,
  fetchDeclarationLeaderBoard,
  instituteFindMeetings,
  checkIsAssigned,
  instituteStatusChecker,
  instituteEventStart,
  instituteEventDelete,
  instituteDeclarationEventStart,
  fetchSelfVotes,
  fetchCommunique,
  fetchLeaderBoard,
  editStudentPoint,
  deleteStudentPoint,
  reportStudentPoint,
  fetchCommuniqueReport
};
