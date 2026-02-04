/*
  Certification Control
  - Create Certificate
  - Fetch All Certificate for Admin 
  - Fetch Certificate for Single Institute
  - Fetch Certificate for single Student
*/

const { mysqlcon } = require("../../model/db");
const { uid } = require("uid");
const moment = require("moment");
const generateCertificate = require("../../service/generateCertificate");
const sendEmailService = require("../../service/email");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const sequelize = require("../../database/connection");
const { QueryTypes, where } = require("sequelize");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { json } = require("body-parser");

async function fetchAllCertificates(req, res) {
  const { studentId } = req.query;
  if (!studentId) {
    res.status(404).json({ message: "Invalid Request" });
  } else {
    mysqlcon.query(
      `SELECT cert.id,cert.courseId,cert.img,cert.certificate_key,cert.accredited_by,cert.endorsed_by,cert.generated,cert.createdAt,cert.updatedAt,stud.first_name,stud.middle_name,stud.last_name,c.course_name,c.desc FROM certificates as cert
      LEFT JOIN students as stud
      ON cert.studentId=stud.id
      LEFT JOIN courses as c
      ON cert.courseId=c.id
      WHERE studentId='${studentId}'`,
      function (err, result) {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        } else {
          res
            .status(200)
            .json({ message: "Certificates Fetched Successfully", result });
        }
      }
    );
  }
}
async function fetchCertificate(req, res) {
  const { courseId, studentId } = req.query;
  if (courseId && studentId) {
    mysqlcon.query(
      `SELECT cert.id,cert.certificate_key,cert.accredited_by,cert.img,cert.endorsed_by,cert.generated,cert.createdAt,cert.updatedAt,stud.first_name,stud.middle_name,stud.last_name,c.slug,c.course_name,c.desc FROM certificates as cert
          LEFT JOIN students as stud
          ON cert.studentId=stud.id
          LEFT JOIN courses as c
          ON cert.courseId=c.id
          WHERE studentId='${studentId}' AND courseId='${courseId}'`,
      function (err, result) {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
        if (result.length === 0)
          return res.status(404).json({ message: "Certificate Not Found" });
        return res.status(200).json({
          message: "Certificates Fetched Successfully",
          result: result[0],
        });
      }
    );
  } else {
    return res.status(404).json({ message: "Invalid Request" });
  }
}
async function fetchOpenCertificate(req, res) {
  const { certkey } = req.query;
  if (!certkey) {
    res.status(404).json({ message: "Invalid Request" });
  } else {
    mysqlcon.query(
      `SELECT cert.id,cert.certificate_key,cert.accredited_by,cert.img,cert.endorsed_by,cert.generated,cert.createdAt,cert.updatedAt,stud.first_name,stud.middle_name,stud.last_name,c.thumbnail,c.slug,c.course_name,c.desc FROM certificates as cert
            LEFT JOIN students as stud
            ON cert.studentId=stud.id
            LEFT JOIN courses as c
            ON cert.courseId=c.id
            WHERE certificate_key='${certkey}'`,
      function (err, result) {
        if (err) {
          logg.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
        if (result.length === 0)
          return res.status(404).json({ message: "Certificate Not Found" });
        return res.status(200).json({
          message: "Certificates Fetched Successfully",
          result: result[0],
        });
      }
    );
  }
}
// POST CERTIFICATE VERSION2
async function makeAndSendCert(
  studentName,
  studentEmail,
  studentId,
  courseId,
  image,
  institute_name,
  callback // Add a callback parameter to receive the certificateId
) {
  let CertificationId = uid().toUpperCase();
  let timestamp = moment(new Date()).format("MM-DD-YYYY");
  let accredited_by = "Yuvamanthan";
  let endorsedBy = "Yuvamanthan";
  const certificateData = {
    name: studentName,
    certNum: CertificationId,
    imgUrl: image,
    email: studentEmail,
    date: timestamp,
    accreditedBy: accredited_by,
    institute_name
  };
  generateCertificate(certificateData, (certUrl) => {
    mysqlcon.query(
      `INSERT INTO certificates (studentId,courseId,certificate_key,accredited_by,endorsed_by,img,createdAt,updatedAt) (SELECT ${studentId},${courseId},'${CertificationId}','${accredited_by}','${endorsedBy}','${certUrl}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP WHERE NOT EXISTS(SELECT 1 FROM certificates WHERE courseId=${courseId} AND studentId=${studentId}))`,
      function (err, result) {
        if (err) {
          throw err;
        } else if (result?.affectedRows == 0) {
        } else {
          let certificationId = result?.insertId;
          let mailConfig = {
            email: studentEmail,
            subject:
              "Congratulations! You have a new certificate from Yuvamanthan!",
          };
          let replacements = {
            username: studentName,
            url: "https://www.yuvamanthan.org/dashboard/certficate/" + courseId,
            name: studentName,
            id: courseId,
            courseName: "NIPAM Certificate Course For Students And Teachers",
            duration: "40 Minutes",
            instructor: certificateData?.accreditedBy,
            // completionDate: certificateData?.date,
            certificateId: certificateData?.certNum,
          };
          sendEmailService.sendTemplatedEmail(mailConfig, replacements, 1);
          // Pass certificateId to callback function
          callback(certificationId); 
        }
      }
    );
  });
}

async function PostCertificate(req, res) {
  const { courseId, studentId } = req.body;
  if (!courseId || !studentId) {
    res.status(404).json({ message: "Invalid Request" });
  } else {
    // FETCHING THE DYNAMIC CERTIFICATE 
    //https://dev-yuvamanthan.s3.ap-south-1.amazonaws.com/data/uploadInstituteLogo//1707745660442WhatsAppImage2024-02-12at6.09.59PM.jpeg first certificate image
   // https://dev-yuvamanthan.s3.ap-south-1.amazonaws.com/data/uploadInstituteLogo//1709210788837RBSMParticipationCertificate.png
    let image =
    "https://dev-yuvamanthan.s3.ap-south-1.amazonaws.com/data/uploadInstituteLogo//1707745660442WhatsAppImage2024-02-12at6.09.59PM.jpeg";
    const CERT_IMG = await sequelize.query(
      `SELECT cert.certificate_url as CERT_IMG FROM students INNER JOIN institute_certificate as cert ON cert.instituteId=students.instituteId WHERE students.id=${studentId}`,
      { type: QueryTypes.SELECT }
    );
    const courseData = await DBMODELS.courses.findOne({
      where :{
        id:courseId
      },
      raw:true
    })
    if (CERT_IMG.length) {
      image = CERT_IMG[0].CERT_IMG;
    }
    if(courseData?.certification_img){
      image = courseData?.certification_img;
    }
    mysqlcon.query(
      `SELECT cert.certificate_key, stud.first_name, stud.last_name, stud.email, inst.institution_name
      FROM students AS stud
      LEFT JOIN certificates AS cert ON cert.studentId = stud.id
      LEFT JOIN institutions AS inst ON inst.id = stud.instituteId
      WHERE (cert.courseId = ${courseId} AND cert.studentId = ${studentId})`,
      function (err, result) {
        let Check = result[0]?.certificate_key;
        let studentEmail = result[0]?.email;
        let studentName = result[0]?.first_name + " " + result[0]?.last_name;
        let institute_name = result[0]?.institution_name;
        if (err) {
          logg.error(err);
          res.status(500).json({
            message: "Internal Server Error",
          });
        } else {
          if (!Check) {
            // Inside this block, make a call to studentDetails function
            studentDetails(studentId, courseId, image, (certificateId) => {
              // Send certificateId in response after status 200
              res.status(200).json({
                message:
                  "Application for Certificate Sent Successfully. You will receive an email once it's Approved",
                certificateId: certificateId // Sending certificateId in response
              });
            });
          } else {
            res.status(409).json({
              message: "Application for certificate already received",
            });
          }
        }
      }
    );
  }
}

const studentDetails = async(id, courseId, image, callback)=>{
  const details = await DBMODELS.students.findOne({
    where:{
      id
    },
    attributes:[
      "first_name","last_name","email",[sequelize.literal(`(
        select institution_name from institutions where students.instituteId =institutions.id
      )`), 'institute_name']
    ],
    raw:true
  })
  const studentName=details?.first_name + " " + details?.last_name
  const studentEmail=details?.email
  const studentId = id
  const institute_name = details?.institute_name

  makeAndSendCert(
    studentName,
    studentEmail,
    studentId,
    courseId,
    image,
    institute_name,
    callback // Pass the callback function to receive the certificateId
  );
}

async function checkCertificate(req, res) {
  const { studentId, courseId } = req.query;
  if (Number(studentId) && Number(courseId)) {
    mysqlcon.query(
      `SELECT count(*) AS checked FROM certificates WHERE studentId=${studentId} AND courseId=${courseId}`,
      (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error while finding Certificate" });
          throw err;
        } else {
          res.status(200).json({ message: "Result", result: result[0] });
        }
      }
    );
  } else {
    res.status(404).json({ message: "Empty Data" });
  }
}

async function PostEkalEventCompletionCertificate(req, res) {
  const { studentName, studentEmail, studentId } = req.body;
  if (studentName && studentEmail && studentId) {
    try {
      const count = await DBMODELS.additional_certificates.findOne({
        where: { studentId, contest: "EKAL_EVENT_UPLOAD", generated: "TRUE" },
        raw: true,
      });
      if (count) {
        DBMODELS.offline_event.update(
          { certificate_key: count?.certificate_key },
          { where: { teacherId: studentId } }
        );
        return res.json({ message: "Certificate Already Generated." });
      }
      let CertificationId = uid().toUpperCase();
      let timestamp = moment(new Date()).format("MM-DD-YYYY");
      let accredited_by = "Yuvamanthan";
      let endorsedBy = "Yuvamanthan";
      const certificateData = {
        name: studentName,
        certNum: CertificationId,
        imgUrl:
          "https://yuvamanthan.s3.ap-south-1.amazonaws.com/course/Ekal_certificate.jpg",
        email: studentEmail,
        date: timestamp,
        accreditedBy: accredited_by,
      };
      generateCertificate(certificateData, (certUrl) => {
        // s3deleteObject(certUrl); ////////temp
        DBMODELS.additional_certificates.create({
          studentId,
          contest: "EKAL_EVENT_UPLOAD",
          certificate_key: CertificationId,
          endorsed_by: endorsedBy,
          img: certUrl ? certUrl : "",
          accredited_by: accredited_by,
          generated: certUrl ? "TRUE" : "FALSE",
        });
        DBMODELS.offline_event.update(
          { certificate_key: CertificationId },
          { where: { teacherId: studentId } }
        );
        res.json({ certUrl, message: "Certificate is Generated." });
      });
    } catch (err) {
      logg.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({ message: "Student Name and email is required! " });
  }
}

function GetEkalEventCompletionCertificate(req, res) {
  const { studentId } = req.query;
  if (studentId) {
    DBMODELS.additional_certificates
      .findAll({ where: { studentId } })
      .then((certificates) => {
        res.json({ certificates });
      })
      .catch((err) => {
        logg.error(err);
        res.status(401).json({ message: "Internal server error" });
      });
  } else {
    res.status(404).json({ message: "StudentId is reqired!!" });
  }
}

const getRating  = async(req,res)=>{
  const {courseId} = req.params
  try {
    if(courseId === undefined ) {
      return res.status(404).json({
        success:false,
        message:"Course not found."
      })
    }
    const getReviewDetails  = await DBMODELS.course_review.findAll({
      where:{
        courseId
      }
    })
    if(!getReviewDetails){
      return res.status(404).json({
        success:false,
        message:"Course Id not found."
      })
    }
    const totalRatings = getReviewDetails?.reduce((sum, item) => sum + Number(item?.rating), 0);
    const totalRatingsLength = getReviewDetails?.length;

        // Calculate the average rating
        const overallRating = totalRatings / totalRatingsLength;
        const fourToFiveStarRatings = getReviewDetails?.filter(item => item?.rating >= 4 && item?.rating <= 5).length;
        const threeToFourStarRatings = getReviewDetails?.filter(item => item?.rating >= 3 && item?.rating <4).length;
        const twoToThreeStarRatings = getReviewDetails?.filter(item => item?.rating >= 2 && item?.rating <3).length;
        const oneToTwoStarRatings = getReviewDetails?.filter(item => item?.rating >= 1 && item?.rating <2).length;
        const fourToFiveStarPercentage = (fourToFiveStarRatings / totalRatingsLength) * 100;
        const threeToFourStarPercentage = (threeToFourStarRatings / totalRatingsLength) * 100;
        const twoToThreeStarPercentage = (twoToThreeStarRatings  / totalRatingsLength) * 100;
        const oneToTwoStarPercentage = (oneToTwoStarRatings / totalRatingsLength) * 100;

        return res.status(200).json({
          success:true,
          overallRating,
          fourToFiveStarPercentage,
          threeToFourStarPercentage,
          twoToThreeStarPercentage,
          oneToTwoStarPercentage,
        })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error?.message || "Internal Server Error"
    })
  }
}

//============== A function for appleing the certificate ================
const PostNipamCertifateApply = async (req, res) => {
  const { userId,role,instituteId,courseId } = req.body;
  try {
    const isAlreadyApplied = await DBMODELS.applied_cert_users.findOne({
      where: {
        userId,
        courseId,
      }
    })

    if(isAlreadyApplied){

      return res.status(200).json({
        success:true,
        message:"You are already applied for the certificate.",
      })
    }
    const createCertificate = await DBMODELS.applied_cert_users.create({
      userId,
      role,
      instituteId,
      courseId,
    })
    return res.status(200).json({
      success:true,
      createCertificate,
      message:"Congratulations on finishing your course!Your certificate will be issued by the Ministry of Commerce and Industry to the email address you have given."
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error?.message || "Internal Server Error"
    })
  }

}

module.exports = {
  fetchAllCertificates,
  fetchCertificate,
  PostCertificate,
  fetchOpenCertificate,
  checkCertificate,
  PostEkalEventCompletionCertificate,
  GetEkalEventCompletionCertificate,
  getRating,
  PostNipamCertifateApply
};
