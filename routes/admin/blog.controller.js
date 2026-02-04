/* 
Blogs Functionalities
-Blogs Add 
-Blog delete 
-Blog Update 
-Blog get All by Id, by slug  */

const { mysqlcon } = require("../../model/db");
var moment = require("moment");
const { default: slugify } = require("slugify");
const { DBMODELS } = require("../../database/models/init-models");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const logg = require("../../utils/utils");
const { where } = require("sequelize");




/*
Functionality: getBlog is fetching all blogs Data.
*/
async function getBlog(req, res) {
  try {
    const result = await DBMODELS.blogs.findAll()
    if(result?.length > 0){
      return res.status(200).json({msg: 'Get all blog', result})
    }
    else{
      return res.status(404).json({msg: 'Data not found', result})
    }
  } catch (error) {
    return res.status(500).json({msg: 'Internal server error', error: error.message})
  }
  // mysqlcon.query(`SELECT * FROM blogs`, (err, result) => {
  //   if (err) {
  //     logg.error(err);
  //     res.status(500).json({
  //       message: "Internal Server Error",
  //     });
  //   } else {
  //     res.status(200).json({
  //       success: 1,
  //       message: "Data Fetched Successfully",
  //       result,
  //     });
  //   }
  // });
}


/* 
Functionality: postBlog is adding a new blog to table.
*/
async function postBlog(req, res) {
  const data = req.body;
  const file = req.file;
  let newDescription = req.body.heading
    .replaceAll(/'/g, " ")
    .replaceAll(/"/g, " ");
  let newContent = req.body?.content
    .replaceAll(/"/g, " ")
    .replaceAll(/'/g, " ");
  if (file) {
    mysqlcon.query(
      `INSERT INTO blogs(title,slug, heading, content, img, bgimg, createdAt, updatedAt, author) VALUES (?,?,?,?,?,?,?,?,?)`,
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
  } else {
    res.status(404).json({ message: "404 Details Not Found" });
  }
}

/* 
Functionality: updateBlog is updating a blog according to blog's Id.
*/
async function updatedBlog(req, res) {
  const data = req.body;
  const file = req.file;
  let newDescription = req.body.heading
    .replaceAll(/'/g, " ")
    .replaceAll(/"/g, " ");
  let newContent = req.body.content.replaceAll(/"/g, " ").replaceAll(/'/g, " ");
  let sql = "";
  if (file?.Location) {
    try {
      const { img } = await DBMODELS.blogs.findByPk(data.id);
      s3deleteObject(img);
    } catch (error) {
      logg.error(error);
    }
    sql = `UPDATE blogs SET title='${data.title}',slug='${slugify(
      data.title.toLowerCase()
    )}', heading ='${newDescription}', content='${newContent}', ${file && `img='${file?.Location}'`
      }, updatedAt='${moment().format()}', author='${data.author}' WHERE id=${data.id
      }`;
  } else {
    sql = `UPDATE blogs SET title='${data.title}',slug='${slugify(
      data.title.toLowerCase()
    )}', heading ='${newDescription}', content='${newContent}', updatedAt='${moment().format()}', author='${data.author
      }' WHERE id=${data.id}`;
  }
  mysqlcon.query(sql, (err, result) => {
    if (err) {
      logg.error(err);
      res.status(500).json({
        success: 0,
        message: "Internal Server error",
      });
    } else {
      res.status(200).json({
        success: 1,
        message: "Data Updated Successfully",
        data: result,
      });
    }
  });
}


/* 
Functionality: deleteBlog is deleting a blog according to blog's Id.
*/
async function deleteBlog(req, res) {
  const { id } = req.query;
  try {
    const { img } = await DBMODELS.blogs.findByPk(id);
    s3deleteObject(img);
  } catch (error) {
    logg.error(error);
  }
  mysqlcon.query(`DELETE FROM blogs WHERE id=?`, [id], (err, results) => {
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
Functionality: getBlogById is getting a blog according to blog's Id.
*/

async function getBlogById(req, res) {
  const { id } = req.params;
  if (id) {
    mysqlcon.query(`SELECT * FROM blogs WHERE id=${id};`, (err, result) => {
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
Functionality: getBlogBySlug is getting a blog according to blog's slug.
*/

async function getBlogBySlug(req, res) {
  const { slug } = req.params;
  console.log(slug)
  try {
    const result = await DBMODELS.blogs.findOne({
      where:{
        slug
      }
    })
    return res.status(200).json({message: "Get data successfully", result})
  } catch (error) {
    return res.status(200).json({message: "Internal server error", error: error.message})
  }
  // if (slug) {
  //   mysqlcon.query(
  //     `SELECT * FROM blogs WHERE slug='${slug}'`,
  //     (err, result) => {
  //       if (err) {
  //         logg.error(err);
  //         res.status(200).json({
  //           success: 0,
  //           message: "Internal Server Error",
  //         });
  //       } else {
  //         result = result[0];
  //         if (result) {
  //           res.status(200).json({
  //             success: 1,
  //             message: "Data Fecthed Successfully",
  //             result,
  //           });
  //         } else {
  //           res.status(404).json({
  //             success: 1,
  //             message: "Data Not Found",
  //           });
  //         }
  //       }
  //     }
  //   );
  // }
}
module.exports = {
  postBlog,
  getBlog,
  updatedBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
};


