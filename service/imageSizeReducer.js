/* image Size Reducer Middleware */
const Jimp = require('jimp');
const fs = require('fs');
const { customFilePathUpload } = require('./bucket');
const logg = require('../utils/utils');
const ImageReduce = (height, path) => {
    return (req, res, next) => {
        if (fs.existsSync(req?.file?.path)) {
            try {
                const imgName = req.file.filename;
                Jimp.read(req.file.path, async (err, FileMain) => {
                    if (err) {
                        logg.error(err);
                        req.file = { Location: "" }
                        next();
                        if (fs.existsSync(req.file.path)) {
                            fs.unlinkSync(req.file.path);
                        }
                    } else {
                        await FileMain
                            .resize(height, Jimp.AUTO)
                            .write(req.file.path);
                        customFilePathUpload(req.file.path, path + imgName, (data) => {
                            req.file = data
                            next();
                        })
                    }
                });
            } catch (error) {
                logg.error(error);
            }
        } else {
            req.file = false;
            next();
        }
    }
}

module.exports = {
    ImageReduce
}