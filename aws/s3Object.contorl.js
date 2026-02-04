/*
  ====== S3 Bucket And Object Control ======
  - Delete bucket Object 
  - fetch buckect object
  - fetch buckects list
  - fetch buckect object List
 */
const AWS = require("aws-sdk");
const { S3 } = require("./connection");
const logg = require("../utils/utils");

function deleteObject(req, res) {
  const { url, key, bucket } = req.body;
  var Key = "";
  if (url?.length) {
    Key = url
      ?.replace(
        `https://${bucket ?? "dev-yuvamanthan"}.s3.ap-south-1.amazonaws.com/`,
        ""
      )
      .replaceAll("%3A", ":")
      .replaceAll("+", " ");
  } else if (key?.length) {
    Key = key;
  }
  if (Key.length) {
    try {
      S3.deleteObject(
        { Bucket: bucket ?? "dev-yuvamanthan", Key },
        (err, data) => {
          if (err) {
            logg.error(err);
            return res.send(200).json({ Error: err });
          } else {
            return res.status(200).json({ message: "File Deleted..", data });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(200).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(200).json({ message: "Data Not Found!!" });
  }
}

function fetchObject(req, res) {
  const { key } = req.body;
  if (key?.length) {
    try {
      var url = S3.getSignedUrl("getObject", {
        Bucket: "yuvamanthan",
        Key: key,
      });
      res.status(200).json({ url });
    } catch (error) {
      logg.error(error);
      res.status(200).json({ error: err });
    }
  } else {
    res.status(204).json({ message: "Data Not Found!!" });
  }
}

function bucketList(req, res) {
  S3.listBuckets(function (err, data) {
    if (err) {
      res.status(204).json({ error: err });
    } else {
      res.status(200).json(data);
    }
  });
}
function bucketObjectList(req, res) {
  const { Bucket } = req.body;
  if (Bucket) {
    S3.listObjects({ Bucket }, function (err, data) {
      if (err) {
        res.status(200).json({ error: err });
      } else {
        res.status(200).json(data);
      }
    });
  } else {
    res.status(204).json({ message: "Data Not Found!!" });
  }
}
module.exports = { deleteObject, bucketList, fetchObject, bucketObjectList };
