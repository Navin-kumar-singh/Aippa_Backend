module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "email_deliveries",
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
            subject: {
                type: DataTypes.STRING(400),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM,
                allowNull: true,
                values: ["sent", "error", "not sent"],
                defaultValue: "sent",
            },
            details: {
                type: DataTypes.STRING(1000),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "email_deliveries",
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
