/*
   ====== Testing File Email Processing =========
   - Store for Further Use   
 */

const multer = require("multer");
const { uid } = require("uid");
const fs = require("fs");
const xlsx = require("xlsx");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
const { hashingPassword } = require("../auth/validation");
const { default: slugify } = require("slugify");
const newSlugify = require("../../middleware/newSlugify");
const { Op } = require("sequelize");
const { log } = require("console");
const path = require("path");
var resetFalg = true;
const passwordToUpdate = [];


async function testingEmail(req, res) {
  const dataSaved = [];
  const data = req.json;
  data?.map((list) => {
    dataSaved.push({
      name: list.First_Name + " " + list.Last_Name,
      email: list.Email,
      password: uid(10),
      type: "institute",
    });
  });

  DBMODELS.emailProcessing
    .bulkCreate(dataSaved, {
      fields: ["name", "email", "password", "type"],
      validate: true,
    })
    .then((result) => {
      if (result.length) {
        res.status(200).json(result);
        // resetFalg = true;
        let temp = Array.from(result);
        passwordToUpdate.push(...temp);
      }
    })
    .catch((error) => {
      logg.error(error);
      res.status(205).json({ message: "Error", error });
    });
}

setInterval(() => {
  if (passwordToUpdate.length) {
    pass = passwordToUpdate.pop();
    uploadPassword(pass);
  }
}, 10);

const studentNotCompletedCourse = async (req, res) => {
  try {
    const students = await DBMODELS.students.findAll();
    const courseEnrolleds = await DBMODELS.course_enrolled.findAll();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studentIds = courseEnrolleds.map(
      (courseEnrolled) => courseEnrolled.studentId
    );

    const filteredStudents = await DBMODELS.students.findAll({
      where: {
        id: studentIds,
        createAt: { [Op.lte]: sevenDaysAgo },
      },
    });

    res.json(filteredStudents);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  // sql query for finding the student who have not finish the course
  //   SELECT s.*
  // FROM students s
  // WHERE s.id IN (
  //   SELECT ce.studentId
  //   FROM course_enrolled ce
  // ) AND s.createdAt <= DATE_SUB(CURDATE(), INTERVAL 7 DAY);
};

async function uploadPassword(student) {
  try {
    // DBMODELS.emailProcessing.update(
    //   {
    //     password: await hashingPassword(student.password),
    //   },
    //   {
    //     where: { id: student.id },
    //   }
    // );
  } catch (error) {
    logg.error(error);
  }
}
module.exports = { testingEmail };

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
// setInterval(() => {
//   if (resetFalg) {
//     resetFalg = false;
//     logg.success("Event");
//     DBMODELS.course_enrolled
//       .findAll({ raw: true, where: { studentId: { [Op.not]: null } } })
//       .then((res) => {
//         // console.log(res);
//         res?.map(async ({ courseId, studentId, section_completed }) => {
//           const result = await DBMODELS.certificates.findOne({
//             where: { courseId, studentId },
//             raw: true,
//           });

//           DBMODELS.sections.count({ where: { courseId } }).then((count) => {
//             console.log(
//               studentId,
//               count,
//               section_completed,
//               result?.certificate_key,
//               count === section_completed
//             );
//           });
//         });
//       });
//   }
// }, 1000);

// async function updatePassword(result) {
//   if (result) {
//     try {
//       result.map((student) => {
//         setTimeout(async () => {
//           uploadPassword(student);
//         }, 500);
//       });
//     } catch (err) {
//       throw err;
//     }
//   }
// }

// Usage example
// const file = "C:/Users/nitin/Desktop/glc/yuvamanthan/Ekal/Teacher_Detail_For_BLSP_Area Dehradun.xlsx";

// let baseName = path.basename(file, path.extname(file));
// async function excelFileToJSON() {
//   try {
//     const workbook = xlsx.readFile(file);

//     // Get the first sheet of the workbook
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Convert sheet data to JSON
//     const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1, range: 1 });

//     // Get the keys from the 2nd row (index 1)
//     const keys = jsonData[0];

//     // Convert the remaining rows to objects using the keys
//     const result = [];
//     for (let i = 1; i < jsonData.length - 1; i++) {
//       const obj = {};
//       for (let j = 0; j < keys.length; j++) {
//         obj[keys[j]] = jsonData[i][j];
//       }
//       result.push(obj);
//     }

//     // Output the JSON result
//     // console.log(result[0], result[result.length - 1]);
//     // log(result);
//     const data = registerData(result);

//     // log(data);
//     // log(data.length);
//     // Create a worksheet from the JSON data
//     // BulkUpload(data, 16727, "teacher");
//   } catch (e) {
//     console.error(e);
//   }
// }
// excelFileToJSON();

// function registerData(data) {
//   let teacherList = [];
//   data.map((l) =>
//     teacherList.push({
//       first_name: l["Teacher Name"]?.split(" ")[0],
//       last_name: l["Teacher Name"]?.split(" ")[1],
//       email: l["Email ID"],
//       contact: l["What's App No"],
//       state: l["Sambhag"],
//       district: l["Anchal"],
//     })
//   );
//   return teacherList;
// }

// async function validate_2(data, instituteId, role) {
//   let emails = [];
//   let dataSaved = [];
//   let dataFailed = [];
//   try {
//     const instituteEmail = await DBMODELS.institutions.findAll({
//       attributes: ["email"],
//       raw: true,
//     });
//     const studentEmails = await DBMODELS.students.findAll({
//       attributes: ["email"],
//       raw: true,
//     });
//     const coordinaterEmail = await DBMODELS.institute_coordinators.findAll({
//       attributes: ["email"],
//       raw: true,
//     });
//     instituteEmail.forEach(({ email }) => {
//       emails = [...emails, email];
//     });
//     studentEmails.forEach(({ email }) => {
//       emails = [...emails, email];
//     });
//     coordinaterEmail.forEach(({ email }) => {
//       emails = [...emails, email];
//     });
//     if (data) {
//       data.map(async ({ first_name, last_name, contact, email }) => {
//         if (first_name && contact && email) {
//           if (emails.includes(email)) {
//             dataFailed = [
//               ...dataFailed,
//               { first_name, last_name, contact, email, Error: "User Exists " },
//             ];
//           } else {
//             dataSaved = [
//               ...dataSaved,
//               {
//                 first_name: first_name,
//                 last_name: last_name ?? "",
//                 contact,
//                 email: email,
//                 status: "active",
//                 password: "YMG20@2023",
//                 instituteId,
//                 role,
//               },
//             ];
//           }
//         } else {
//           dataFailed = [
//             ...dataFailed,
//             {
//               first_name,
//               last_name,
//               contact,
//               email,
//               Error: "User Data Missing",
//             },
//           ];
//         }
//       });
//       return { dataSaved, dataFailed };
//     }
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

// async function BulkUpload(data, instituteId, role) {
//   if (data?.length <= 2000000 && data.length > 0) {
//     await validate_2(data, instituteId, role)
//       .then(async ({ dataSaved, dataFailed }) => {
//         if (dataSaved || dataFailed) {
//           try {
//             log(dataSaved);
//             const result = await DBMODELS.students.bulkCreate(dataSaved, {
//               fields: [
//                 "first_name",
//                 "last_name",
//                 "contact",
//                 "status",
//                 "email",
//                 "password",
//                 "instituteId",
//                 "role",
//               ],
//               validate: true,
//             });
//             try {
//               let temp = Array.from(result);
//               passwordToUpdate.push(...temp);
//               const baseName = path.basename(file, path.extname(file));
//               if (dataSaved?.length) {
//                 const ws = xlsx.utils.json_to_sheet(dataSaved);
//                 const wb = xlsx.utils.book_new();
//                 xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
//                 const filename =
//                   "Ekal_" + baseName + "-" + dataSaved.length + ".xlsx";
//                 xlsx.writeFile(wb, filename);
//               }
//               if (dataFailed?.length) {
//                 const ws = xlsx.utils.json_to_sheet(dataFailed);
//                 const wb = xlsx.utils.book_new();
//                 xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
//                 const filename =
//                   "Ekal_" + baseName + "-FAILED" + uid(3) + ".xlsx";
//                 xlsx.writeFile(wb, filename);
//               }
//               log(baseName + " DataSaved : " + dataSaved?.length);
//             } catch (err) {
//               console.log(err);
//             }
//           } catch (err) {
//             log({ message: "Data Uploaded Failed!!", err, dataFailed });
//           }
//         }
//       })
//       .catch((err) => {
//         log({ message: "Data Uploaded Failed!!" });
//       });
//   } else if (data.length === 0) {
//     log({ message: "No Data Found " });
//   } else if (data.length > 2000) {
//     log({ message: "Exceed Data Limit !!!" });
//   } else {
//     log({ message: "Internal Server Error!!" });
//   }
// }

// setInterval(() => {
//   if (passwordToUpdate.length) {
//     pass = passwordToUpdate.pop();
//     uploadPassword(pass);
//   }
// }, 20);

// async function uploadPassword(student) {
//   try {
//     DBMODELS.students.update(
//       {
//         password: await hashingPassword(student.password),
//         permission: JSON.stringify({
//           master: true,
//           ekalMasterTeacher: true,
//         }),
//       },
//       {
//         where: { id: student.id },
//       }
//     );
//     // logg.success("Password Updated....")
//   } catch (error) {
//     logg.error(error);
//   }
// }
