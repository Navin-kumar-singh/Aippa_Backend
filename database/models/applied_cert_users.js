const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('applied_cert_users', {
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
        courseId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }
       
    }, {
        tableName: 'applied_cert_users',
        timestamps: true,
    });
};
