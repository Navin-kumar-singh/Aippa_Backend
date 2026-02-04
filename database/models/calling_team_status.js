const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('calling_team_status', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        schoolId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        subAdminId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        call_status:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        reminder_status:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        detail_sent_status:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        registration_status:{
            type: DataTypes.STRING,
            allowNull: true,
        }

    }, {
        tableName: 'calling_team_status',
        timestamps: true,
    });
};
