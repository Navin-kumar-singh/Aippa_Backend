const express = require("express");
const { carBonCalculatorTransport } = require("./carbon_calculator");

const carbonRouter = express.Router();

carbonRouter.post("/transport", carBonCalculatorTransport)

module.exports = {
    carbonRouter
}