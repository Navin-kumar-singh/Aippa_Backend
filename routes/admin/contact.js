
/*  Contact US  
-Fetch All contacts data  
-Delete Contact US data by ID
*/
const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");


/* 
functionality: contact function is fetching all contacts data from contactus table
 */

async function contact(req, res) {
  try {
    const data = await DBMODELS.contactus.findAll();
    res.status(200).json({
      message: "Data Fetched",
      result: data
    })
  }
  catch (error) {
    logg.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
}



/* 
functionality: deleteContactUs function is deleting a contact from contactus table according to Id.
 */
async function deleteContactUs(req, res) {
  const { id } = req.query;
  mysqlcon.query(`DELETE FROM contactus WHERE id= ${id}`, (err, results) => {
    if (err) {
      logg.error(err);
      return res.status(500).json({
        success: 0,
        message: "Internal Errer!!!",
      });
    }
    if (results.affectedRows == 0) {
      return res.status(404).json({
        success: 0,
        message: "Record Not Found",
      });
    } else {
      return res.status(200).json({
        success: 1,
        message: "Data Deleted Succesfully",
      });
    }
  });
}


module.exports = { contact, deleteContactUs }