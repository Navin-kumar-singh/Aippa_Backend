const { addImageComment, fetchCommentByImageId } = require("./GalleryControl");
const {
  getResourcesLibrary,
  getYouthGallery,
  postStateContent,
} = require("./content.controller");
/*
==== Content Control Routes =====
- routes for the  Youth gallery or resource library on public page 
- Form control for State Wise Content
*/

const contentRouter = require("express").Router();
contentRouter.get("/resource", getResourcesLibrary);
contentRouter.get("/youthgallery", getYouthGallery);
contentRouter.post("/state", postStateContent);

/* Galery Routes */
contentRouter.get("/gallery-comment", fetchCommentByImageId);
contentRouter.post("/gallery-comment", addImageComment);
module.exports = contentRouter;
