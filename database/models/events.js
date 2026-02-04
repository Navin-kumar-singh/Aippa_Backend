module.exports = function (sequelize, DataTypes) {
    return sequelize.define("events", {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        discussion_title: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: "events",
        timestamps: true,
      }
    )
}