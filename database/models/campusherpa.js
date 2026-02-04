const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campusherpa', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    middle_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    institute_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    institute_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    contact: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    g20_certification_num: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    social_active: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    views_on_g20: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    topics: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'campusherpa',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "topics",
        using: "BTREE",
        fields: [
          { name: "topics", length: 768 },
        ]
      },
    ]
  });
};
