/* Middleware for converting Excel data to Json */

const xlsx = require("xlsx");
const fs = require("fs");
const multer = require("multer");
const { customFilePathUpload } = require("../service/bucket");
const sendEmailService = require("../service/email");
const { uid } = require("uid");

function excelToJson(req, res, next) {
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
      customFilePathUpload(
        file.path,
        "bulkRegister/" +
        req.user?.id +
        "__" +
        uid(4) +
        "_" +
        file.originalname,
        (data) => {
          if (data) {
            return
            // console.log('data', data)
            // sendEmailService(
            //   [
            //     "saurabhcoded@gmail.com",
            //     "santoshskt9@gmail.com",
            //     "ayukumar1010@gmail.com",
            //   ],
            //   "Bulk Register File",
            //   `<h3>Institute ID: ${req.user?.id}</h3> 
            //   <h3>Institute Name: ${req.user?.institution_name}</h3> 
            //   <h3>Institute Email: ${req.user?.email}</h3> 
            //   <h3>Institute Contact: ${req.user?.contact_no}</h3> 
            //   <p>${data?.Location}</p>`
            // );
          }
        }
      );
      next();
    }
  } else if (file) {
    res.status(205).json({ message: "File Format Not Supported!" });
  } else {
    res.status(205).json({ message: "File Not Found!" });
  }
}

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

module.exports = { excelToJson, uploader };

// const convertFile = (file) => {
//   const fileData = xlsx.readFile(file.path);
//   const sheetNames = fileData.SheetNames;
//   const totalSheets = sheetNames.length;
//   let parsedData = [];
//   for (let i = 0; i < totalSheets; i++) {
//     // Convert to json using xlsx
//     const tempData = xlsx.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]);
//     // Skip header row which is the colum names
//     tempData.shift();
//     // Add the sheet's json to our data array
//     parsedData.push(...tempData);
//     return parsedData;
//   }
// };
