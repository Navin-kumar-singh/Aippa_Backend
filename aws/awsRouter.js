/*
  ===== S3 Controler Routes ==========
  - S3 bucket Control
  - S3 object Control 
*/

const {
  deleteObject,
  bucketList,
  fetchObject,
  bucketObjectList,
} = require("./s3Object.contorl");

const awsRouter = require("express").Router();
//S3 Bucket
awsRouter.get("/s3Bucket", bucketList);
awsRouter.post("/s3Bucket", bucketObjectList);

//S3 Objects
awsRouter.delete("/s3Object", deleteObject);
awsRouter.post("/s3Object", fetchObject);

module.exports = awsRouter;
