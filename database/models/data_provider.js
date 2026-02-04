const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('data_provider', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        subAdmin_Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        projects: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull:true
        }

    }, {
        tableName: 'data_provider',
        timestamps: true,
    });
};
