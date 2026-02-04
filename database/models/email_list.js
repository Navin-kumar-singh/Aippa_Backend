module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "email_list",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM,
                allowNull: true,
                values: ["blacklist", "complaint", "whitelist"],
                defaultValue: "blacklist",
            },
            description: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "email_list",
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
    );
};
