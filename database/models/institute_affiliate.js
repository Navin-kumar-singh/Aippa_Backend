const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('institute_affiliate', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        instituteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        }
    }, {
        sequelize,
        tableName: 'institute_affiliate',
        timestamps: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            }
        ]
    })
};