
/* Gallery Images for Institute operating by Admin
-Add Gallery Images to a institute 
-Get Gallery Images ofr a institute 
-update gallery images for a institute 
-delete gallery images for a institute
*/

const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");



/* 
Functionality: getGallery function fetch the data from institute_gallery and the data is like image and alttext.
*/

async function getGallery(req, res) {
  const { id } = req.params;
  if (id) {
    try {
      const data = await DBMODELS.institute_gallery.findAll({
        where: {
          instituteId: id,
        },
      });
      res.status(200).json({
        message: "Fetched All Resources",
        result: data,
      });
    } catch (error) {
      logg.error(error);
      res.status(500).json({
        message: "Internal Server Srror",
      });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}


/* 
Functionality: postGallery function add the data to institute_gallery and the data is like image and alttext.
*/

async function postGallery(req, res) {
  const { id } = req.params;
  const { alttext } = req.body;
  if ((id, alttext)) {
    try {
      const data = await DBMODELS.institute_gallery.create({
        img: req.file.Location,
        alttext,
        instituteId: id,
      });
      res
        .status(200)
        .json({ message: "Data Posted Successfully", result: data });
    } catch (error) {
      logg.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}

/* 
Functionality: updateGallery function update the data to institute_gallery and the data is like image and alttext according to id.
*/

async function updateGallery(req, res) {
  const { alttext, id } = req.body;
  if (id) {
    try {
      const data = await DBMODELS.institute_gallery.update(
        {
          img: req.file.Location,
          alttext,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res
        .status(200)
        .json({ message: "Data Updated Sucessfully", result: data });
    } catch (error) {
      logg.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}


/* 
Functionality: deleteGallery function delete the data from institute_gallery according to id.
*/

async function deleteGallery(req, res) {
  const { id } = req.query;
  if (id) {
    try {
      const { img } = await DBMODELS.institute_gallery.findByPk(id);
      s3deleteObject(img);
      const data = await DBMODELS.institute_gallery.destroy({ where: { id } });
      res.status(200).json({
        message: "Data Deleted Succesfully",
        result: data,
      });
    } catch (error) {
      logg.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}
module.exports = { postGallery, getGallery, updateGallery, deleteGallery };





