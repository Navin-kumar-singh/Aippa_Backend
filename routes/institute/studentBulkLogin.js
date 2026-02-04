/* 
  ==========  Student Bulk registration Control  =========
  - Add Bulk Registered date 
  - update hash password 
  - send date for email processing.
*/

const { uid } = require("uid");
const { DBMODELS } = require("../../database/models/init-models");
// const { sendTemplatedEmail } = require("../../service/email");
// const { hashingPassword } = require("../auth/validation");
const { emailProcessing } = require("./emailProcessing");
const logg = require("../../utils/utils");
const moment = require("moment");
const multer = require("multer");
const passwordToUpdate = [];

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const instituteId = req.user.id;
//     const { role } = req.params;

//     const folderName =
//       role === "student"
//         ? "RegisteredStudents"
//         : role === "teacher"
//         ? "RegisteredTeachers"
//         : null;

//     if (!folderName) {
//       return cb(new Error("Invalid role specified"), false);
//     }

//     const uploadDir = path.join(
//       process.cwd(),
//       "School-files-temp",
//       instituteId.toString(),
//       folderName
//     );

//     if (!existsSync(uploadDir)) {
//       mkdirSync(uploadDir, { recursive: true });
//     }

//     cb(null, uploadDir);
//   },

//   filename: function (req, file, cb) {
//     const now = moment();
//     const formattedTimestamp = now.format("YYYY-MM-DD_HH-mm");
//     const extension = path.extname(file.originalname);

//     const newFileName = `${formattedTimestamp}${extension}`;
//     cb(null, newFileName);
//   },
// });

const fileFilter = function (req, file, cb) {
  const fileType = path.extname(file.originalname).toLowerCase();
  if (
    file &&
    (fileType === ".csv" || fileType === ".xlsx" || fileType === ".xls")
  ) {
    return cb(null, true);
  } else {
    return cb(new Error("Only CSV, XLS, and XLSX files are allowed!"));
  }
};

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 },
// }).single("file");

// const uploadTempInstituteFile = function (req, res) {
//   const instituteId = req.user.id;
//   const { role } = req.params;
//   // console.log(req.params);
//   // console.log(`Found: ${instituteId} and ${role}`);
//   const now = moment();
//   const formattedTimestamp = now.format("YYYY-MM-DD_HH-mm");
//   // console.log(`File upload Request Made by: ${instituteId} for ${role}`);

//   if (!instituteId || !role) {
//     return res
//       .status(400)
//       .json({ message: "instituteId and role are required" });
//   }

//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json({ message: err.message });
//     } else if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     // console.log("File saved on: ", formattedTimestamp);
//     res.status(200).json({ message: "File uploaded successfully!" });
//   });
// };

async function validateAndSave(dataArray, instituteId, role, correctness) {
  // var emails = [];
  var dataSaved = [];
  var dataFailed = [];
  try {
    //   // Fetch existing emails from different models
    //   const instituteEmail = await DBMODELS.institutions.findAll({
    //     attributes: ["email"],
    //     raw: true,
    //   });
    //   const studentEmails = await DBMODELS.students.findAll({
    //     attributes: ["email"],
    //     raw: true,
    //   });
    //   const coordinaterEmail = await DBMODELS.institute_coordinators.findAll({
    //     attributes: ["email"],
    //     raw: true,
    //   });
    //   instituteEmail.forEach(({ email }) => {
    //     emails = [...emails, email];
    //   });
    //   studentEmails.forEach(({ email }) => {
    //     emails = [...emails, email];
    //   });
    //   coordinaterEmail.forEach(({ email }) => {
    //     emails = [...emails, email];
    //   });

    // Process each record in the dataArray
    dataArray.map(
      ({
        First_Name,
        Last_Name,
        Father_Name,
        Contact,
        Email,
        Date_Of_Birth,
        Class,
        Stream,
        Gender,
      }) => {
        if (Contact || Email) {
          // if (emails.includes(Email)) {
          //   dataFailed.push({
          //     First_name, Last_name, Contact, Email,
          //     Error: "User Exists"
          //   });
          // } else {
          dataSaved.push({
            first_name: First_Name,
            last_name: Last_Name ?? "",
            father_name: Father_Name ?? "",
            contact: Contact,
            email: Email,
            dob: moment(Date_Of_Birth, "DD-MM-YYYY").isValid()
              ? moment(Date_Of_Birth, "DD-MM-YYYY").format("YYYY-MM-DD")
              : "",
            status: "active",
            password: "@Yuva" + uid(4),
            instituteId,
            role: role,
            class: Class,
            stream: Stream,
            gender: Gender,
            correctness: correctness,
          });
          // }
        } else {
          dataFailed.push({
            First_Name,
            Last_Name,
            Contact,
            Email,
            Error: "User Data Missing!!",
          });
        }
      }
   );

    return { dataSaved, dataFailed };
  } catch (err) {
    logg.error(err);
    throw err;
  }
}

async function studentBulkLogin(req, res) {
  const instituteId = req.user.id;
  const { role } = req.body;
  const { correctData, incorrectData } = req.body;

  try {
    const [correctResults, incorrectResults] = await Promise.all([
      validateAndSave(correctData, instituteId, role, "correct"),
      validateAndSave(incorrectData, instituteId, role, "incorrect"),
    ]);
    // console.log("correctResults value", correctResults);
    // console.log("incorrectResults value", incorrectResults);
    const finalSavedData = [
      ...correctResults.dataSaved,
      ...incorrectResults.dataSaved,
    ];
    const finalFailedData = [
      ...correctResults.dataFailed,
      ...incorrectResults.dataFailed,
    ];

    if (finalSavedData.length > 0) {
      const result = await DBMODELS.all_teacher_student.bulkCreate(
        finalSavedData,
        {
          fields: [
            "first_name",
            "last_name",
            "father_name",
            "contact",
            "status",
            "email",
            "password",
            "instituteId",
            "dob",
            "role",
            "class",
            "stream",
            "gender",
            "correctness",
          ],
          validate: true,
        }
      );
      // console.log(fields);

      passwordToUpdate.push(...result);
      // emailProcessing(result, "STUDENT");

      res.status(200).json({
        message: "Data Uploaded Successfully.",
        dataSaved: result,
        dataFailed: finalFailedData,
      });
    } else {
      res
        .status(201)
        .json({ message: "No Data to Save", dataFailed: finalFailedData });
    }
  } catch (err) {
    logg.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
}

async function studentBulkLoginAdminCSV(req, res) {
  const { role, instituteId } = req.body;
  const { correctData, incorrectData } = req.body;

  try {
    const [correctResults, incorrectResults] = await Promise.all([
      validateAndSave(correctData, instituteId, role, "correct"),
      validateAndSave(incorrectData, instituteId, role, "incorrect"),
    ]);

    const finalSavedData = [
      ...correctResults.dataSaved,
      ...incorrectResults.dataSaved,
    ];
    const finalFailedData = [
      ...correctResults.dataFailed,
      ...incorrectResults.dataFailed,
    ];
    // console.log(finalSavedData);

    if (finalSavedData.length > 0) {
      const result = await DBMODELS.all_teacher_student.bulkCreate(
        finalSavedData,
        {
          fields: [
            "first_name",
            "last_name",
            "father_name",
            "contact",
            "status",
            "email",
            "password",
            "instituteId",
            "dob",
            "role",
            "class",
            "stream",
            "gender",
            "correctness",
          ],
          validate: true,
        }
      );

      passwordToUpdate.push(...result);

      res.status(200).json({
        message: "Data Uploaded Successfully.",
        dataSaved: result,
        dataFailed: finalFailedData,
      });
    } else {
      res
        .status(201)
        .json({ message: "No Data to Save", dataFailed: finalFailedData });
    }
  } catch (err) {
    logg.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
}

async function studentBulkLoginAdmin(req, res) {
  const { role, instituteId, emailProcess } = req.body;
  const data = req.json;
  if (!instituteId && !role && !emailProcess) {
    return res.status(201).json({ message: "Institute ID and Role Required " });
  }
  if (data?.length <= 5000 && data.length > 0) {
    await validate(data, instituteId, role)
      .then(async ({ dataSaved, dataFailed }) => {
        if (dataSaved || dataFailed) {
          try {
            const result = await DBMODELS.all_teacher_student.bulkCreate(
              dataSaved,
              {
                fields: [
                  "first_name",
                  "last_name",
                  "father_name",
                  "contact",
                  "status",
                  "email",
                  "password",
                  "instituteId",
                  "dob",
                  "role",
                  "class",
                  "stream",
                  "isPresent",
                ],
                validate: true,
              }
            );
            res.status(200).json({
              message: "Data Uploaded Successfuly.",
              dataSaved: result,
              dataFailed,
            });
            try {
              let temp = Array.from(result);
              passwordToUpdate.push(...temp);
              // console.log("result",result)
              // console.log(emailProcess === "true", emailProcess);
              if (emailProcess === "true" ? true : false) {
                emailProcessing(result, "STUDENT"); //Email to student.
              }
              // emailWelcomeInstitute(result);
              // emailLoginCredentials(result);
            } catch (err) {
              logg.error(err);
            }
          } catch (err) {
            logg.error(err);
            res
              .status(404)
              .json({ message: "Data Uploaded Failed!!", err, dataFailed });
          }
        }
      })
      .catch((err) => {
        logg.error(err);
        res.status(201).json({ message: "Data Uploaded Failed!!" });
      });
  } else if (data.length === 0) {
    res.status(201).json({ message: "No Data Found " });
  } else if (data.length > 2000) {
    res.status(201).json({ message: "Exceed Data Limit !!!" });
  } else {
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}

async function checkEmails(req, res) {
  var defaltEmails = [];
  var excistsEmails = [];
  const emails = req.body;
  try {
    const instituteEmail = await DBMODELS.institutions.findAll({
      attributes: ["email"],
      raw: true,
    });
    const studentEmails = await DBMODELS.students.findAll({
      attributes: ["email"],
      raw: true,
    });
    const coordinaterEmail = await DBMODELS.institute_coordinators.findAll({
      attributes: ["email"],
      raw: true,
    });
    instituteEmail.forEach(({ email }) => {
      defaltEmails = [...defaltEmails, email];
    });
    studentEmails.forEach(({ email }) => {
      defaltEmails = [...defaltEmails, email];
    });
    coordinaterEmail.forEach(({ email }) => {
      defaltEmails = [...defaltEmails, email];
    });
    excistsEmails = emails?.filter((e) => defaltEmails.includes(e));
    res.json({ status: 200, emails: excistsEmails });
  } catch (err) {
    logg.error(err);
    res.json({ status: 500, message: "Something Went Wrong" });
  }
}

module.exports = {
  studentBulkLogin,
  studentBulkLoginAdminCSV,
  studentBulkLoginAdmin,
  checkEmails,
  // uploadTempInstituteFile,
};
