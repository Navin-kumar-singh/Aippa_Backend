/*
Admin Institute tab certificates
-Get certificate Data according to institute 
-add certificate data for by Institute  
-update certificate Data by Institute 
-Delete certificate Data by Institute
*/


const { mysqlcon } = require("../../model/db");
var moment = require("moment");
const logg = require("../../utils/utils");


/* 
Functionality: getCertificatesData fetch the certificate data of a Single Institute according to institute's Id.
*/

async function getCertificatesData(req, res) {
  const institueId = req.params;
  if (institueId) {
    mysqlcon.query(`SELECT * FROM institute_certificate WHERE instituteId=${institueId.id}`, (err, result) => {
      if (err) {
        logg.error(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Data Fetched Successfully",
          result: result,
        });
      }
    });
  } else {
    return res.status(404).json({
      message: "Data Not Found",
    });
  }
}


/* 
Functionality: postCertificateData add the certificate data to institute's certificate table with certificate of institute and other data.
*/

async function postCertificateData(req, res) {
  const data = req.body;
  let file = req.file.Location;
  const InstituteId = req.params;
  if (file && data.state && InstituteId.id) {
    //Post h ya nhi
    mysqlcon.query(`SELECT * FROM institute_certificate  WHERE instituteId='${InstituteId.id}';`, (err, result) => {
      //Agar Error
      if (err) {
        logg.error(err);
        return res.status(500).json({
          success: 0,
          message: "Internal server Error",
        });
        //idhr Result
      } else {
        //If Result FOUND
        checkPostAvail = result.length;
        //length == 0 matlab koi post nhi
        if (!checkPostAvail) {
          //Then Post the querry
          //Post h ya nhi
          mysqlcon.query(
            `INSERT INTO institute_certificate(certificate_url, state, createdAt, updatedAt, instituteId) 
        VALUES('${file}','${data.state}', '${moment().format()}','${moment().format()}','${InstituteId.id}')`,
            (err, result) => {
              //Agar Error
              if (err) {
                logg.error(err);
                return res.status(500).json({
                  success: 0,
                  message: "Internal server Error",
                });
              } else {
                return res.status(200).json({
                  success: 1,
                  message: "Data Posted Successfully",
                  result: result,
                });
              }
            }
          );
        } else {
          // Idhr already post h
          res.status(409).json({ message: "Resource Already Availabel please edit" });
        }
      }
    });
  } else {
    return res.status(200).json({
      message: "Data Not Found",
    });
  }
}



/* 
Functionality: updateCertificateData update the certificate data to institute's certificate table with certificate of institute and other data.
*/

async function updateCertificateData(req, res) {
  const data = req.body;
  const InstituteId = req.params;
  let file = req.file;
  let sql;
  if (data.state && InstituteId.id) {
    if (!file) {
      sql = `UPDATE institute_certificate SET state='${data.state
        }', createdAt='${moment().format()}', updatedAt='${moment().format()}' WHERE instituteId=${InstituteId.id}`;
    } else {
      sql = `UPDATE institute_certificate SET certificate_url='${file.Location}', state='${data.state
        }', createdAt='${moment().format()}', updatedAt='${moment().format()}' WHERE instituteId=${InstituteId.id}`;
    }
    mysqlcon.query(sql, (err, result) => {
      if (err) {
        logg.error(err);
        return res.status(500).json({
          success: 0,
          message: "internal Server Error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Data Updated Successfully",
          result: result,
        });
      }
    });
  } else {
    return res.status(404).json({
      message: "Data Not Found",
    });
  }
  // res.status(200).json({
  //     message:"working fine"
  // })
}


/* 
Functionality: deleteCertificateData delete the certificate data from institute's certificate table.
*/

async function deleteCertificateData(req, res) {
  const InstituteId = req.params;
  if (InstituteId) {
    mysqlcon.query(`DELETE FROM institute_certificate WHERE instituteId=${InstituteId.id}`, (err, result) => {
      if (err) {
        logg.error(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Sverver Error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Deleted Successfully",
          result: result,
        });
      }
    });
  } else {
    return res.status(404).json({
      message: "Didn't Got InstituteId",
    });
  }
}
module.exports = { getCertificatesData, postCertificateData, updateCertificateData, deleteCertificateData };


