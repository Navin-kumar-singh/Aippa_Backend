/* 
Functions for Website Content part of Admin

-Add Data to youth Gallery / get Resource Libraries documents pdf for ModelG20/ Add Resource Libraries documents pdf for ModelG20 / Update Resource Libraries documents pdf for ModelG20 / Delete Libraries documents pdf for ModelG20
*/


const { DBMODELS } = require("../../database/models/init-models");
const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");


/* 
functionality: postYouthGallery is adding data of a Youth partiticipant with its image and other text content. 
*/

async function postYouthGallery(req, res) {
  const { name, subinfo, content, id, order } = req.body;
  const { attr } = req.query;
  let img = req?.file?.Location
  if (attr == "add") {
    if (name && subinfo && content && req.file && attr && order) {
      sql = `INSERT INTO youth_gallery(name,subinfo,img,content,orderInt) VALUES('${name}','${subinfo}','${img}','${content}','${order}')`;
      mysqlcon.query(sql, function (err, result) {
        if (err) {
          logg.error(err);
          res.json({ status: "ERROR", message: "Resources Not Found" });
        } else {
          res.status(200).json({
            status: "SUCCESS",
            message: "Resources Found",
            resources: result,
          });
        }
      });
    } else {
      res.status(404).json({ message: "Missing Attributes" });
    }
  } else if (attr == "update") {
    if (name && subinfo && content && attr && id && order) {
      if (req.file) {
        let img = req?.file?.Location
        sql = `UPDATE youth_gallery SET name='${name}',subinfo='${subinfo}',img='${img}',content='${content}', orderInt='${order}' WHERE id=${id}`;
      } else {
        sql = `UPDATE youth_gallery SET name='${name}',subinfo='${subinfo}',content='${content}', orderInt='${order}' WHERE id=${id}`;
      }
      mysqlcon.query(sql, function (err, result) {
        if (err) {
          logg.error(err);
          res.json({ status: "ERROR", message: "Resources Not Found" });
        } else {
          res.status(200).json({
            status: "SUCCESS",
            message: "Resources Found",
            resources: result,
          });
        }
      });
    } else {
      res.status(404).json({ message: "Missing Attributes Missing" });
    }
  } else if (attr == "delete") {
    if (id) {
      sql = `DELETE FROM youth_gallery WHERE id=${id}`;
      mysqlcon.query(sql, function (err, result) {
        if (err) {
          logg.error(err);
          res.json({ status: "ERROR", message: "Resources Not Found" });
        } else {
          res.status(200).json({
            status: "SUCCESS",
            message: "Resources Found",
            resources: result,
          });
        }
      });
    }
  } else {
    res.status(404).json({ message: "Missing Attributes" });
  }
}


/* 
functionality: fetchResourceLibrary is fetching all resources like document of communique resources.
*/

async function fetchResourceLibrary(req, res) {
  try {
    const Data = await DBMODELS.resource_library.findAll();

    res.status(200).json({ message: "Fetched All Resources", result: Data })
  } catch (error) {
    logg.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }

}

//timestamps: true,

// // I don't want createdAt
// createdAt: false,

// // I want updatedAt to actually be called updateTimestamp
// updatedAt: 'updateTimestamp' });

/* 
functionality: postResourcesLibrary is adding resources like document of communique resources.
*/
async function postResourcesLibrary(req, res) {
  const { group_id, group_name, title, description } = req.body;
  if (group_id && group_name && title && description) {
    try {
      const Data = await DBMODELS.resource_library.create({ group_id, group_name, title, description, pdf: req?.file?.location, posted_at: new Date() });
      res.status(200).json({ message: "Data Posted Succesfully", result: Data })

    } catch (error) {
      logg.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }

  } else {
    res.status(404).json({
      message: "Data Not Found"
    })
  }
  // const { attr } = req.query;


}


/* 
functionality: updateResourcesLibrary is updating resources like document of communique resources by Id.
*/
async function updateResourcesLibrary(req, res) {
  const { id } = req.params;
  const { group_id, group_name, title, description } = req.body;
  if (group_id && group_name && title) {
    try {
      const Data = await DBMODELS.resource_library.update({ group_id, group_name, title, description, pdf: req?.file?.location }, { where: { id } });
      res.status(200).json({ message: "Data updated Succesfully", result: Data })

    } catch (error) {
      logg.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }

  } else {
    res.status(404).json({
      message: "Data Not Found"
    })
  }
  // const { attr } = req.query;


}



/* 
functionality: deleteResourcesLibrary is updating resources like document of communique resources by Id.
*/
async function deleteResourcesLibrary(req, res) {
  const { id } = req.params;
  logg.error(id)


  if (id) {
    try {
      const Data = await DBMODELS.resource_library.destroy({ where: { id } });
      res.status(200).json({ message: "Data Deleted Succesfully", result: Data })

    } catch (error) {
      logg.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }

  } else {
    res.status(404).json({
      message: "Data Not Found"
    })
  }
  // const { attr } = req.query;


}
module.exports = { postYouthGallery, fetchResourceLibrary, postResourcesLibrary, updateResourcesLibrary, deleteResourcesLibrary };
