const express = require("express");
const { getAllMUNGallery, postMunGallery, deleteMunGallery, postMunMedia, getMunMeadia, deleteMunMedia, postMunCommuinque, deleteMunCommuinque, getMunCommuinque } = require("./model_un_media_image.controller");
const { LocalMulter } = require("../../service/localMulter");
const { ImageReduce } = require("../../service/imageSizeReducer");
const modelUnMediaRouter = express.Router();
///============== APi for adding, deleting the image  gallery ===============\\

modelUnMediaRouter.get('/institute-gallery/:id',getAllMUNGallery)
modelUnMediaRouter.post(
    "/institute-gallery/:id",
    LocalMulter.single("img"),
    ImageReduce(500, "instituteGallery/"),
    postMunGallery
  );
  modelUnMediaRouter.delete("/institute-gallery/:id", deleteMunGallery);
  ///=============== APi for adding ,deleting and getting details of media coverage ===============\\
  modelUnMediaRouter.post('/institute-media/:id',LocalMulter.single('img'),
  ImageReduce(500,"instituteGallery/"),
  postMunMedia)
  modelUnMediaRouter.get('/institute-media/:id',getMunMeadia)
  modelUnMediaRouter.delete('/institute-media/:id',deleteMunMedia)
  ///=============== APi for adding ,deleting and getting details of Commuinque ===============\\
  modelUnMediaRouter.post('/institute-commuinque/:id',LocalMulter.single('file'),
  ImageReduce(500,"instituteGallery/"),
  postMunCommuinque)
  modelUnMediaRouter.get('/institute-commuinque/:id',getMunCommuinque)
  modelUnMediaRouter.delete('/institute-commuinque/:id',deleteMunCommuinque)
module.exports = {modelUnMediaRouter}