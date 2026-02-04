/*
  AWS Buckect Connection 
 */
const AWS = require("aws-sdk");
const aws_config = {
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEYGEN,
};

AWS.config.setPromisesDependency();
AWS.config.update(aws_config);
const S3 = new AWS.S3();

module.exports = { S3 };
