const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

function addImageComment(req, res) {
  const { id } = req.query;
  const body = req.body;
  if (body.comment && id && body.studentId) {
    body.imageId = id;
    DBMODELS.gallery_comments
      .create(body)
      .then(() => {
        res.json({ message: "Comment Update" });
      })
      .catch((err) => {
        console.error(err);
        res.json({ message: "Internal Server Error!!" });
      });
  } else {
    res.json({ message: "Incomplete Post Request !!" });
  }
}

function fetchCommentByImageId(req, res) {
  const { id } = req.query;
  if (id) {
    sequelize
      .query(
        `SELECT gc.* ,COALESCE ( CONCAT( st.first_name , " ", st.last_name ) , inst.institution_name ) AS first_name , COALESCE( st.profile, inst.logo) AS profile , COALESCE( st.id, inst.id)  AS Id FROM gallery_comments AS gc 
      LEFT JOIN students AS st ON st.id = gc.studentId AND ( gc.role = "student" OR gc.role = "teacher" )
      LEFT JOIN institutions AS inst ON inst.id = gc.studentId AND gc.role = "admin"
       WHERE gc.imageId = ${id}  ORDER BY gc.createdAt DESC `
      )
      .then(([result]) => {
        res.json({ result });
      })
      .catch((err) => {
        logg.error(err);
        res.status(500).json({ message: "Internal server Error!" });
      });
  } else {
    res.status(404).json({ message: "Image Id is Required!" });
  }
}
module.exports = { addImageComment, fetchCommentByImageId };
