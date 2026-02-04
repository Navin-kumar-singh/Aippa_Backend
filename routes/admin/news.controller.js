/*
news functinalities operating by admin
-Add news
-get news
-update news 
-delete news 
-get news by news id 
-get news by slug  
*/




const { mysqlcon } = require("../../model/db");
var moment = require("moment");
const { default: slugify } = require("slugify");
const logg = require("../../utils/utils");
const { DBMODELS } = require("../../database/models/init-models");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");



/* 
Functionality: getNews fetch the all news data.
*/

// async function getNews(req, res) {
//   mysqlcon.query(`SELECT * FROM news`, (err, result) => {
//     if (err) {
//       logg.error(err);
//       res.status(500).json({
//         message: "Internal Server Error",
//       });
//     } else {
//       res.status(200).json({
//         success: 1,
//         message: "Data Fetched Successfully",
//         result,
//       });
//     }
//   });
// }

const getNews = async(req, res)=>{
  try {
    const getNews = await DBMODELS.news.findAll({
      order: [['createdAt', 'DESC']]
    })
    return res.status(200).json({
      success: 1,
      message: "Data Fetched Successfully",
      result: getNews,
    });
    
  } catch (error) {
    return res.status(500).json({message: "Server Error", error: error.message})
  }
}


/* 
Functionality: postNews add the news data to news table.
*/
async function postNews(req, res) {
  const data = req.body;
  const file = req.file;
  const { title, heading, content, bgimg, author, publish_date } = req.body;
  console.log(data)
  let newDescription = req.body.heading
    .replaceAll(/'/g, " ")
    .replaceAll(/"/g, " ");
  let newContent = req.body.content.replaceAll(/"/g, " ").replaceAll(/'/g, " ");
  if (title && heading && content && author && publish_date) {
    mysqlcon.query(
      `INSERT INTO news(title,slug, heading, content, img, bgimg, createdAt, updatedAt, author, publish_date) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        data.title,
        slugify(data.title.toLowerCase()),
        newDescription,
        newContent,
        file.Location,
        data.bgimg,
        moment().format(),
        moment().format(),
        data.author,
        data.publish_date
      ],
      (err, results) => {
        if (err) {
          logg.error(err);
          return res.status(500).json({
            success: 0,
            message: "Database Connection Error",
          });
        } else {
          return res.status(200).json({
            success: 1,
            message: "Data Created Successfully",
            data: results,
          });
        }
      }
    );
  }
}

/* 
Functionality: updateNews update the news data according to id.
*/
async function updateNews(req, res) {
  const data = req.body;
  const file = req.file;
  let newDescription = req.body.heading
    .replaceAll(/'/g, " ")
    .replaceAll(/"/g, " ");
  let newContent = req.body.content.replaceAll(/"/g, " ").replaceAll(/'/g, " ");

  let sql = "";
  if (file?.Location) {
    try {
      const res = DBMODELS.news.findByPk(data.id);
      s3deleteObject(res.img, "dev-yuvamanthan");
    } catch (error) {
      logg.error(error);
    }
    sql = `UPDATE news SET title='${data.title}',slug='${slugify(
      data.title.toLowerCase()
    )}', heading ='${newDescription}', content='${newContent}' ${file && `, img='${file?.Location}'`
      }, updatedAt='${moment().format()}', author='${data.author}' WHERE id=${data.id
      }`;
  } else {
    sql = `UPDATE news SET title='${data.title}',slug='${slugify(
      data.title.toLowerCase()
    )}', heading ='${newDescription}', content='${newContent}', updatedAt='${moment().format()}', author='${data.author
      }' WHERE id=${data.id}`;
  }
  mysqlcon.query(sql, (err, result) => {
    if (err) {
      logg.error(err);
      res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    // if (result.afftectedRows) {
    //     res.status(404).json({
    //         message: "Field Not Found"
    //     })
    // }
    else {
      res.status(200).json({
        success: 1,
        message: "Data Updated Successfully",
        data: result,
      });
    }
  });
}

/* 
Functionality: deleteNews delete the news data from news table according to id. 
*/

async function deleteNews(req, res) {
  const { id } = req.query;
  try {
    const { img } = DBMODELS.news.findByPk(id);
    s3deleteObject(img, "dev-yuvamanthan");
  } catch (error) {
    logg.error(error);
  }
  mysqlcon.query(`DELETE FROM news WHERE id=?`, [id], (err, results) => {
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

/* 
Functionality: getNewsById fetch the news data accordng to Id.
*/
async function getNewsById(req, res) {
  const { id } = req.params;
  if (id) {
    mysqlcon.query(`SELECT * FROM news WHERE id=${id};`, (err, result) => {
      if (err) {
        logg.error(err);
        res.status(200).json({
          success: 0,
          message: "Internal Server Error",
        });
      } else {
        result = result[0];
        if (result) {
          res.status(200).json({
            success: 1,
            message: "Data Fecthed Successfully",
            result,
          });
        } else {
          res.status(404).json({
            success: 1,
            message: "Data Not Found",
          });
        }
      }
    });
  }
}


/* 
Functionality: getNewsBySlug fetch the news data accordng to slug.
*/
async function getNewsBySlug(req, res) {
  const { slug } = req.params;
  try {
    if(slug){
      const singleNews = await DBMODELS.news.findOne({ where: { slug } });
      if(singleNews){
        res.status(200).json({
          success: 1,
          message: "Data Fecthed Successfully",
          result: singleNews
        });
      }else{  
        res.status(404).json({
          success: 1,
          message: "Data Not Found",
        });
      }
    }else{
      res.status(404).json({
        success: 1,
        message: "Data Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
  // if (slug) {

  //   mysqlcon.query(`SELECT * FROM news WHERE slug='${slug}'`, (err, result) => {
  //     if (err) {
  //       logg.error(err);
  //       res.status(200).json({
  //         success: 0,
  //         message: "Internal Server Error",
  //       });
  //     } else {
  //       result = result[0];
  //       if (result) {
  //         res.status(200).json({
  //           success: 1,
  //           message: "Data Fecthed Successfully",
  //           result,
  //         });
  //       } else {
  //         res.status(404).json({
  //           success: 1,
  //           message: "Data Not Found",
  //         });
  //       }
  //     }
  //   });
  // } else {
  //   res.status(404).json({ message: "Error 404" });
  // }
}
module.exports = {
  postNews,
  getNews,
  updateNews,
  deleteNews,
  getNewsById,
  getNewsBySlug,
};


