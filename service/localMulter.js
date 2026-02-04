/* local Multer Middlware */


const multer = require("multer");
const slugify = require("slugify");
const { uid } = require("uid")
const { v4 } = require("uuid");
const slugOptions = {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
};
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "tmp");
        },
        filename: function (req, file, cb) {
            cb(null, `${uid(4) + slugify(file.originalname, slugOptions)}`);
        },
    }),
});
module.exports = {
    LocalMulter: upload,
};
