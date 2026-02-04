/* middleware for S3 bucket uploader
 */

const AWS = require("aws-sdk");
const fs = require("fs");
const logg = require("../utils/utils");
const aws_config = {
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: "ap-south-1",
  secretAccessKey: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEYGEN,
};

AWS.config.setPromisesDependency();
AWS.config.update(aws_config);
const S3 = new AWS.S3();
function UploadBucket(filepath, certNum, cb) {
  let certificate;
  S3.upload(
    {
      Bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
      Body: fs.createReadStream(filepath),
      Key: `cetificate/${certNum}.png`,
    },
    (err, data) => {
      if (err) {
        logg.error(err);
        certificate = false;
        cb(certificate);
      } else {
        certificate = data.Location;
        fs.unlinkSync(filepath);
        cb(certificate);
      }
    }
  );
}
function customFilePathUpload(filepath, path, cb) {
  let certificate;
  if (fs.existsSync(filepath)) {
    S3.upload(
      {
        Bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
        Body: fs.createReadStream(filepath),
        Key: path,
      },
      (err, data) => {
        if (err) {
          logg.error(err);
          certificate = false;
          cb(certificate);
        } else {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          cb(data);
        }
      }
    );
  } else {
    certificate = false;
    cb(certificate);
  }
}
module.exports = UploadBucket;
module.exports.customFilePathUpload = customFilePathUpload;
