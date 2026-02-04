/*
 ==== S3 Object control functions ====
 - Delete object from the Bucket Function
 */

const { link } = require("joi");
const logg = require("../utils/utils");
const { S3 } = require("./connection");
const URL = require("url");

function s3deleteObject(url) {
  logg.success(url);
  const bucket = getBucketFromUrl(url);
  var Key = "";
  if (url?.length) {
    var Key = decodeURIComponent(
      url.slice(url.lastIndexOf("amazonaws.com/") + 14)
    );
  } else {
    logg.warning("Image URL Not Found!!");
  }
  if (Key.length) {
    try {
      if (bucket && Key) {
        // logg.info({ Key, bucket });
        S3.deleteObject({ Bucket: bucket, Key }, (err, data) => {
          if (err) {
            logg.error(err);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return;
}

module.exports = { s3deleteObject };

function getBucketFromUrl(url) {
  const regex = /^https?:\/\/([^/]+)/;
  const match = url.match(regex);

  if (match && match.length >= 2) {
    const bucket = match[1].split(".")[0];
    return bucket;
  }

  return null;
}
