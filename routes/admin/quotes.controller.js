/* 
Blogs Functionalities
-quote Add 
-quote delete 
-quote Update   
-quote get All by Id, by slug  */

const { mysqlcon } = require("../../model/db");
var moment = require("moment");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");

/* 
Functionality: postQuote add the data to quotes table.
*/
async function postQuote(req, res) {
  // logic
  const data = req.body;
  const file = req.file;
  if (data && file) {
    mysqlcon.query(
      `INSERT INTO quotes(title,createdAt, updatedAt, quote, img, quoteBy )
        values(?,?,?,?,?,?)`,
      [
        data.title,
        moment().format(),
        moment().format(),
        data.quote,
        file.Location,
        data.quoteBy,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: ("Database connection error", err),
          });
        }
        return res.status(200).json({
          success: 1,
          data: results,
        });
      }
    );
  } else {
    res.status(404).json({ message: "Data Not Found !" });
  }
}

/* 
Functionality: getQuote fetch the all quotes data from quotes table.
*/
async function getQuote(req, res) {
  mysqlcon.query(`SELECT * FROM quotes`, (err, result) => {
    if (err) {
      logg.error(err);
      res.status(500).json({ message: "Internal Server error" });
    } else {
      res.status(200).json({
        message: "Data Fetched Successfully",
        result,
      });
    }
  });
}

/* 
Functionality: updateQuote update the Quote data in quotes table according id.
*/
async function updateQuote(req, res) {
  // logic
  const data = req.body;
  const file = req.file;
  const { title, quote, quoteBy, id } = req.body;
  if (title && file && quote && quoteBy && id) {
    //? UPDATING the Fields
    try {
      const { img } = await DBMODELS.quotes.findByPk(id);
      s3deleteObject(img);
    } catch (error) {
      logg.error(error);
    }
    DBMODELS.quotes
      .update(
        {
          title,
          updatedAt: moment().format(),
          img: file.Location,
          quote,
          quoteBy,
        },
        { where: { id } }
      )
      .then((result) => {
        return res.status(200).json({
          success: 1,
          message: "updated successfully",
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
    const Data = await DBMODELS.admin.findAll();
  } else {
    DBMODELS.quotes
      .update(
        { title, updatedAt: moment().format(), quote, quoteBy },
        { where: { id } }
      )
      .then((result) => {
        return res.status(200).json({
          success: 1,
          message: "updated successfully",
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
    const Data = await DBMODELS.admin.findAll();
  }
}

/* 
Functionality: deleteQuote delete the data from quotes table accordng to id.
*/

async function deleteQuote(req, res) {
  // logic
  const { id } = req.query;
  try {
    const { img } = await DBMODELS.quotes.findByPk(id);
    s3deleteObject(img);
  } catch (error) {
    logg.error(error);
  }
  mysqlcon.query(`DELETE FROM quotes WHERE id = ?`, [id], (err, result) => {
    if (err) {
      logg.error(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    if (result.affectedRows == 0) {
      return res.status(404).json({
        success: 0,
        message: "Record Not Found",
      });
    } else {
      return res.status(200).json({
        success: 1,
        message: "deleted Successfully",
      });
    }
  });
}
module.exports = { postQuote, getQuote, updateQuote, deleteQuote };
