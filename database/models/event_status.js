const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "event_status",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meeting_status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["started", "pause", "end"],
        defaultValue: "started",
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      relMeetingId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      meetingtype: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["resolution", "track", "declaration", "joint_declaration"],
        defaultValue: "resolution",
      },
      roomId: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      track: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      theme: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "event_status",
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
