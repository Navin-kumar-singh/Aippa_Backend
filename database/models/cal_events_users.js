const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cal_events_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instituteId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        activity_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        tableName: 'cal_events_users',
        timestamps: true,
    });
};
