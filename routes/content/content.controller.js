/* 
  ===Content Control Resource Library or Event gallery 
 */

const { mysqlcon } = require("../../model/db");
const fs = require("fs");
const { StateFormSchema } = require("../auth/validation");
const logg = require("../../utils/utils");



/* Functionality :- getResourcesLibrary function fetch all resources pdf from resource_library table */
async function getResourcesLibrary(req, res) {
  sql = `SELECT * FROM resource_library WHERE 1`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      return res.json({ status: "ERROR", message: "Resources Not Found" });
    } else {
      return res.json({
        status: "SUCCESS",
        message: "Resources Found",
        resources: result,
      });
    }
  });
}
/* Functionality :- getYouthGallery function fetch all images and other data from youth_gallery table */


async function getYouthGallery(req, res) {
  sql = `SELECT * FROM youth_gallery WHERE 1`;
  mysqlcon.query(sql, function (err, result) {
    if (err) {
      return res.json({ status: "ERROR", message: "Resources Not Found" });
    } else {
      return res.json({
        status: "SUCCESS",
        message: "Resources Found",
        resources: result,
      });
    }
  });
}



async function postStateContent(req, res) {
  let validated = StateFormSchema.validate(req.body)
  // Validation Error
  if (validated.error) {
    res.status(403).json({ status: "ERROR", message: validated.error.message });
  } else {
    sqlvalues = [
      validated.value.title,
      validated.value.subheading,
      validated.value.quotes,
      validated.value.author,
      validated.value.subauthor,
      validated.value.paragraph,
      validated.value.images,
      validated.value.carousel,
      validated.value.ulpoints,
      validated.value.cards
    ]
    sql = `INSERT INTO eventPageForm(title,subheading,quotes,author,subauthor,paragraph,images,carousel,ulpoints,cards) VALUES(?,?,?,?,?,?,?,?,?,?)`;
    mysqlcon.query(sql, sqlvalues, (err, result) => {
      if (err) {
        logg.error(err);
        return res.status(400).json({
          status: "ERROR",
          message: "Something Went Wrong Plz try again later",
        })
      } else {
        return res.status(200).json({
          status: "SUCCESS",
        })

      }
    });
  }
}
module.exports = {
  getResourcesLibrary,
  getYouthGallery,
  postStateContent
};
