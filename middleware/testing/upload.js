const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
const aws_config = {
    accessKeyId: process.env.AWS_ACCESS_ID || "AKIAYGKIKZ6RKIRWV3MU",
    region: "ap-south-1",
    secretAccessKey:
      process.env.AWS_ACCESS_KEY || "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",
  };

  AWS.config.setPromisesDependency();
  AWS.config.update(aws_config);
  const S3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    acl: "public-read",
    s3: S3,
    bucket: "yuva",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+file.originalname);
    },
  }),
});

module.exports = upload