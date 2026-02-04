const EksathiRouter = require("express").Router();

EksathiRouter.get('/', function (req, res) {
    return res.status(200).json({
        apiKey: process.env.EKS_API_KEY,
        apiSecret: process.env.EKS_SECRET_KEY,
        apiToken: process.env.EKS_TOKEN
    });
});

module.exports = EksathiRouter;