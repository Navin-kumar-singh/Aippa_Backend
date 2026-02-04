const Sequelize = require('sequelize');
module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        "model_un_commuinque",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
              },
              title: {
                type: DataTypes.STRING(300),
                allowNull: true,
              },
              desc: {
                type: DataTypes.STRING(1000),
                allowNull: true,
              },
              link: {
                type: DataTypes.STRING(300),
                allowNull: true,
              },
              img: {
                type: DataTypes.STRING(300),
                allowNull: true,
              },
              instituteId: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              eventType: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'YMUN',
              },   
           
        },
        {
            sequelize,
            tableName: "model_un_commuinque",
            timestamps: true,
            indexes: [
              {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [{ name: "id" }],
              },
            ],
          }
    )
}