const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cal_events', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        role:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        location: {
            type: DataTypes.JSON,
            allowNull: true,
        },

    }, {
        tableName: 'cal_events',
        timestamps: true,
    });
};
