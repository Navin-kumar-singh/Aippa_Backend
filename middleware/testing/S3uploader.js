
const AWS = require('aws-sdk')
const fs = require("fs");
const logg = require('../../utils/utils');
const aws_config = {
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: "ap-south-1",
  secretAccessKey:
    process.env.AWS_ACCESS_KEY || "cSLCNmxUOxjga9TC9iqfVIqkdG1F1mOVZa5WmXe9",
};

AWS.config.setPromisesDependency();
AWS.config.update(aws_config);
const S3 = new AWS.S3();

function S3uploader(req, res, next) {
  const file = req.file
  S3.upload(
    {
      ACL: "public-read",
      Bucket: "yuva/tempImg",
      region: "ap-south-1",
      Body: fs.createReadStream(file.path),
      Key: file.filename + ".png",
    },
    (err, data) => {
      if (err) {
        logg.error(err);
        res.status(404).json({ message: "Fail To Upload File On S3" })
      } else {
        fs.unlinkSync(file.path)
        req.fileurl = data.Location
        next()
      }
    }
  );
}

module.exports = S3uploader