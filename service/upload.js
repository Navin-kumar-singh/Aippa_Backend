/* Multer middlware with S3 */
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const aws_config = {
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: process.env.AWS_REGION || "ap-south-1",
  secretAccessKey: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEYGEN,
};

AWS.config.setPromisesDependency();
AWS.config.update(aws_config);
const S3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.AWS_BUCKET || "yuvamanthan",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const folder = req.route.path;
      cb(
        null,
        "data" +
        folder +
        "/" +
        Date.now().toString() +
        file.originalname
          .replaceAll(" ", "")
          .replaceAll(":", "")
          .replaceAll("@", "")
      );
    },
  }),
});

const getSingedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET || "yuvamanthan",
    Key: key,
    Expires: 60 * 10
  };
  try {
    const url = await new Promise((resolve, reject) => {
      S3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    return { status: "success", result: url };
  } catch (err) {
    if (err) {
      return { status: "error", result: err };
    }
  }
}

module.exports = { upload, getSingedUrl };
