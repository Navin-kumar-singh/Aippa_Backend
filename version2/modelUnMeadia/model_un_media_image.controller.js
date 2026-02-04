const { s3deleteObject } = require("../../aws/s3ObjectFunctions");
const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
///============= Get All event gallery image of particular institute ================\\

const getAllMUNGallery = async(req,res)=>{
    const { id } = req.params;
    if (id) {
      try {
        const data = await DBMODELS.model_un_gallery.findAll({
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
///============= Post All event  gallery image of particular institute ================\\
const postMunGallery = async(req,res)=>{

        const { id } = req.params;
        const { alttext } = req.body;
        if ((id)) {
          try {
            const data = await DBMODELS.model_un_gallery.create({
              img: req?.file?.Location,
              alttext,
              instituteId: id,
            });
            res
              .status(200)
              .json({ message: "Data Posted Successfully", result: data });
          } catch (error) {
            logg.error(error);
            console.log(error.message)
            res.status(500).json({ message: "Internal Server Error" });
          }
        } else {
            
          res.status(404).json({
            message: "Data Not Found",
          });
        }

}
const deleteMunGallery= async(req, res)=> {
    const { id } = req.params;
    if (id) {
      try {
       
        const { img } = await DBMODELS.model_un_gallery.findByPk(id);
        s3deleteObject(img);
        const data = await DBMODELS.model_un_gallery.destroy({ where: { id } });
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

  //=========== A function for add the image in media coverage ================
const postMunMedia =async(req,res) =>{
  const { id } = req.params;
  const { title, desc, link }  = req.body;
  if ((id)) {
    try {
      const data = await DBMODELS.model_un_mediaCoverage.create({
        img: req?.file?.Location || '',
        title, 
        desc, 
        link,
        instituteId: id,
      });
      res
        .status(200)
        .json({ message: "Data Posted Successfully", result: data });
    } catch (error) {
      logg.error(error);
      console.log(error.message)
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
      
    res.status(404).json({
      message: "Data Not Found",
    });
  }
}

const getMunMeadia = async(req,res) =>{
  const {id} = req.params
  if (id) {
    try {
      const data = await DBMODELS.model_un_mediaCoverage.findAll({
        where: {
          instituteId: id,
        },
      });
      res.status(200).json({
        message: "Fetched All  Ymun Media Coverage",
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
const deleteMunMedia= async(req, res)=> {
  const { id } = req.params;
  if (id) {
    try {
     
      const { img } = await DBMODELS.model_un_mediaCoverage.findByPk(id);
      s3deleteObject(img);
      const data = await DBMODELS.model_un_mediaCoverage.destroy({ where: { id } });
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
  //=========== A function for add the image in Commuinque================
  const postMunCommuinque =async(req,res) =>{
    const { id } = req.params;
    const { title, desc, link }  = req.body;
    if ((id)) {
      try {
        const data = await DBMODELS.model_un_commuinque.create({
          img: req?.file?.Location || '',
          title, 
          desc, 
          link,
          instituteId: id,
        });
        res
          .status(200)
          .json({ message: "Data Posted Successfully", result: data });
      } catch (error) {
        logg.error(error);
        console.log(error.message)
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
        
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  }
  
  const getMunCommuinque = async(req,res) =>{
    const {id} = req.params
    if (id) {
      try {
        const data = await DBMODELS.model_un_commuinque.findAll({
          where: {
            instituteId: id,
          },
        });
        res.status(200).json({
          message: "Fetched All Commuinque.",
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
  const deleteMunCommuinque= async(req, res)=> {
    const { id } = req.params;
    if (id) {
      try {
       
        const  {img} = await DBMODELS.model_un_commuinque.findByPk(id);
        s3deleteObject(img);
        const data = await DBMODELS.model_un_commuinque.destroy({ where: { id } });
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
module.exports={
    getAllMUNGallery ,
    postMunGallery,
    deleteMunGallery,
    postMunMedia,
    getMunMeadia,
    deleteMunMedia,
    postMunCommuinque,
    getMunCommuinque,
    deleteMunCommuinque
}