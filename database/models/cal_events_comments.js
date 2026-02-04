const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cal_events_comments', {
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
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    }, {
        tableName: 'cal_events_comments',
        timestamps: true,
    });
};
