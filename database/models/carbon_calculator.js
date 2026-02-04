const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('carbonFootprint_Transportation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    residentialArea: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    typeofVehicle: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fuelType: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    fuelEfficiency: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    frequency: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    domesticFlights: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    internationalFlights: {
      type: DataTypes.TEXT,
    //   allowNull: false
    },
    numberofDomesticFlights: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    averageDomesticDistance: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    numberofInterFlights: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    averageInternationalDistance: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
    calculateValue: {
      type: DataTypes.INTEGER,
    //   allowNull: false
    },
  });
};
