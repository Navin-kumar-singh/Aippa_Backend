const { uid } = require("uid");
const { DBMODELS } = require("../../database/models/init-models");
// const { emailProcessing } = require("./emailProcessing");
const logg = require("../../utils/utils");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const express = require("express");
const app = express();

const passwordToUpdate = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const instituteId = req.user.id;
    const { instituteId, role } = req.params;

    const folderName =
      role === "student"
        ? "RegisteredStudents"
        : role === "teacher"
        ? "RegisteredTeachers"
        : null;

    if (!folderName) {
      return cb(new Error("Invalid role specified"), false);
    }

    const uploadDir = path.join(
      process.cwd(),
      "School-files-temp",
      instituteId.toString(),
      folderName
    );

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // const instituteId = req.user.id;
    const { instituteId, role } = req.params;
    const now = moment();
    const formattedTimestamp = now.format("YYYY-MM-DD_HH-mm-ss");
    const extension = path.extname(file.originalname);

    const newFileName = `${formattedTimestamp}_${instituteId}_${role}${extension}`;
    cb(null, newFileName);
  },
});

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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("file");

const uploadTempInstituteFile = function (req, res) {
  // const instituteId = req.user.id;
  const { instituteId, role } = req.params;
  const now = moment();
  const formattedTimestamp = now.format("YYYY-MM-DD_HH-mm-ss");

  if (!instituteId || !role) {
    return res
      .status(400)
      .json({ message: "instituteId and role are required" });
  }

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Error 1: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error 2: " + err.message });
    }
    try {
      const extension = path.extname(req.file.originalname);
      const newFileName = `${formattedTimestamp}_${instituteId}_${role}${extension}`;

      await DBMODELS.institute_csv_admin.create({
        instituteId: instituteId,
        role: role,
        file_name: newFileName,
      });

      res.status(200).json({
        message: "File uploaded and data feeded successfully!!",
      });
    } catch (dbError) {
      return res
        .status(500)
        .json({ message: "Database error: " + dbError.message });
    }
  });
};

async function validateAndSave(dataArray, instituteId, role, correctness) {
  var dataSaved = [];
  var dataFailed = [];

  try {
    // Process each record in the dataArray
    dataArray.map(
      ({
        first_name,
        last_name,
        father_name,
        mother_name,
        guardian1,
        guardian2,
        contact,
        email,
        dob,
        classNum,
        section,
        stream,
        gender,
        address,
        otherData,
      }) => {
        if (contact || email) {
          dataSaved.push({
            first_name: first_name,
            last_name: last_name ?? "",
            father_name: father_name ?? "",
            mother_name: mother_name ?? "",
            guardian_one: guardian1 ?? "",
            guardian_two: guardian2 ?? "",
            contact: contact,
            email: email,
            dob: moment(dob, "DD-MM-YYYY").isValid()
              ? moment(dob, "DD-MM-YYYY").format("YYYY-MM-DD")
              : "",
            status: "active",
            password: "@Yuva" + uid(4),
            instituteId,
            role: role,
            class: classNum,
            section: section,
            stream: stream,
            gender: gender,
            address: address,
            correctness: correctness,
            otherData: otherData,
          });
        } else {
          dataFailed.push({
            first_name,
            last_name,
            contact,
            email,
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
  // const { role } = req.body;
  const { role, correctData, incorrectData } = req.body;

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

    if (finalSavedData.length > 0) {
      const result = await DBMODELS.all_teacher_student.bulkCreate(
        finalSavedData,
        {
          fields: [
            "first_name",
            "last_name",
            "father_name",
            "mother_name",
            "guardian_one",
            "guardian_two",
            "contact",
            "status",
            "email",
            "password",
            "instituteId",
            "dob",
            "role",
            "class",
            "section",
            "stream",
            "gender",
            "correctness",
            "address",
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
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

async function studentBulkLoginAdminCSV(req, res) {
  const {
    role,
    fileName,
    instituteId,
    correctData,
    incorrectData,
    submittedSheets,
    totalSize,
  } = req.body;

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

    if (finalSavedData.length > 0) {
      const result = await DBMODELS.all_teacher_student.bulkCreate(
        finalSavedData,
        {
          fields: [
            "first_name",
            "last_name",
            "father_name",
            "mother_name",
            "guardian_one",
            "guardian_two",
            "contact",
            "status",
            "email",
            "password",
            "instituteId",
            "dob",
            "role",
            "class",
            "section",
            "stream",
            "gender",
            "correctness",
            "address",
            "otherData",
          ],
          validate: true,
        }
      );

      if (result) {
        const sheetIndexUpdated = await DBMODELS.institute_csv_admin.update(
          { sheetIndexes: submittedSheets },
          {
            where: {
              file_name: fileName,
              instituteId: instituteId,
              role: role,
            },
          }
        );
        if (!sheetIndexUpdated) {
          return res.json({
            message: "Sheet Index Updation Failed!!",
            error: error.message,
          });
        }
        if (totalSize === submittedSheets.length) {
          const fileUpdateStatus = await DBMODELS.institute_csv_admin.update(
            { isUploaded: 1 },
            {
              where: {
                file_name: fileName,
                instituteId: instituteId,
                role: role,
              },
            }
          );
          if (!fileUpdateStatus) {
            return res.json({
              message: "Sheet Index Updation Failed!!",
              error: error.message,
            });
          }
        }
      }

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

const csvInstituteList = async (req, res) => {
  try {
    const instituteIdList = await DBMODELS.institute_csv_admin.findAll(
      {
        where: {
          isUploaded: 0,
        },
      },
      {
        attributes: [
          [
            Sequelize.fn("DISTINCT", Sequelize.col("instituteId")),
            "instituteId",
          ],
          "assignedTo",
        ],
        raw: true,
      }
    );

    const ids = instituteIdList.map((item) => item.instituteId);

    if (ids.length > 0) {
      const instituteList = await DBMODELS.institutions.findAll({
        where: {
          id: ids,
        },
        attributes: ["id", "institution_name", "email"],
        raw: true,
      });

      const result = instituteList.map((institution) => {
        const assignedRecord = instituteIdList.find(
          (item) => item.instituteId === institution.id
        );
        return {
          ...institution,
          assignedTo: assignedRecord ? assignedRecord.assignedTo : null,
        };
      });

      return res.status(200).json({
        message: "Institute List Fetched Successfully!!",
        result: result,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Institute List Fetching Failed!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignedInstituteList = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: "ID is required in the request body" });
    }

    const instituteIdList = await DBMODELS.institute_csv_admin.findAll({
      where: {
        isUploaded: 0,
        assignedTo: id,
      },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("instituteId")), "instituteId"],
      ],
      raw: true,
    });

    const ids = instituteIdList.map((item) => item.instituteId);

    if (ids.length > 0) {
      const instituteList = await DBMODELS.institutions.findAll({
        where: {
          id: ids,
        },
        attributes: ["id", "institution_name", "email"],
        raw: true,
      });

      return res.status(200).json({
        message: "Institute List Fetched Successfully!!",
        result: instituteList,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No institutes assigned to the provided ID." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function adminFetchCSVList(req, res) {
  const { instituteId } = req.params;
  try {
    const files = await DBMODELS.institute_csv_admin.findAll(
      {
        where: {
          instituteId: instituteId,
          isUploaded: 0,
        },
      },
      {
        attributes: ["file_name", "role"],
      }
    );

    if (!files.length) {
      return res.status(404).json({ message: "No files found" });
    }
    res.status(200).json(files);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving files: " + error.message });
  }
}

// const adminFetchCSV = async (req, res) => {
//   try{
//     const allInstituteFileList =  DB.institute_csv_admin.findAll({
//       raw:true
//     });

//     if(allInstituteFileList){
//       return res.json({
//           message:'Fetched All The CSV List of Institutes Successfully!!',
//           result:allInstituteFileList
//       });
//     }
//     else{
//       return res.json({
//           message:'No CSV List Found!!',
//       });
//     }
//   } catch (error){
//     return res.json({
//       error:error.message
//     });
//   }
// };

app.use(
  "/download",
  express.static(path.join(process.cwd(), "School-files-temp"))
);

const getDownloadLink = function (req, res) {
  const { fileName, instituteId, role } = req.params;

  const filePath = path.join(
    process.cwd(),
    "School-files-temp",
    instituteId.toString(),
    role === "student" ? "RegisteredStudents" : "RegisteredTeachers",
    fileName
  );

  if (existsSync(filePath)) {
    const downloadLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v2/csvUpload/download-file/${fileName}/${instituteId}/${role}`;
    res.status(200).json({
      message: "File ready for download",
      downloadLink: downloadLink,
    });
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};

const downloadInstituteFile = function (req, res) {
  const { fileName, instituteId, role } = req.params;
  // const instituteId = req.user.id;

  const filePath = path.join(
    process.cwd(),
    "School-files-temp",
    instituteId.toString(),
    role === "student" ? "RegisteredStudents" : "RegisteredTeachers",
    fileName
  );

  if (existsSync(filePath)) {
    res.download(filePath, fileName, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error downloading file: " + err.message });
      }
    });
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};

const instituteFileUploadStatus = async (req, res) => {
  const { instituteId, role } = req.params;
  try {
    const fileUploadStatus = await DBMODELS.institute_csv_admin.findOne({
      where: {
        instituteId: instituteId,
        role: role,
      },
      attributes: ["isUploaded"],
    });

    if (!fileUploadStatus.isUploaded) {
      return res.status(404).json({
        message: "CSV List has been not uploaded by Admin yet!!",
      });
    } else {
      return res.status(200).json({
        message: "CSV List has been successfully uploaded by Admin!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!!",
      error: error.message,
    });
  }
};

const getSubadminList = async (req, res) => {
  try {
    const subadminList = await DBMODELS.admin.findAll({
      where: {
        role: "subAdmin",
      },
      attributes: ["id", "first_name", "last_name", "role"],
    });

    if (!subadminList.length) {
      return res.status(404).json({
        message: "No such data found!!",
      });
    } else {
      return res.status(200).json({
        message: "List fetched successfully!!",
        result: subadminList,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!!",
      error: error.message,
    });
  }
};

const assignSubadmin = async (req, res) => {
  const { subId, instituteId } = req.body;
  try {
    const [isAssigned] = await DBMODELS.institute_csv_admin.update(
      { assignedTo: subId },
      { where: { instituteId: instituteId } }
    );

    if (isAssigned === 0) {
      return res.status(404).json({
        message: "Sub-Admin assignment failed!!",
      });
    } else {
      return res.status(200).json({
        message: "Sub-Admin assignment successful!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!!",
      error: error.message,
    });
  }
};

module.exports = {
  studentBulkLogin,
  studentBulkLoginAdminCSV,
  adminFetchCSVList,
  assignedInstituteList,
  instituteFileUploadStatus,
  downloadInstituteFile,
  getSubadminList,
  assignSubadmin,
  uploadTempInstituteFile,
  getDownloadLink,
  csvInstituteList,
};
