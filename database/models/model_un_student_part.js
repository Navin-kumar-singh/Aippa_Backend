const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_un_student_part', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    model_un_register_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    secretariatType: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
   nominationType: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pre_register_sec_email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pre_register_pc_email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
   last_registration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pref_country: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pref_role: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pref_designation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pref_committee: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    selectedCommittee : {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reason_of_reject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    committeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    secretariatsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
  },
    pressCorpsId: {
    type: DataTypes.INTEGER,
    allowNull: true,
},
    status:{
      type: DataTypes.ENUM,
      allowNull: true,
      values: ["hold", "pending", "approved", "resigned", "rejected"],
      defaultValue: "pending",
    },
    is_participant: {
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    }, {
      tableName: 'model_un_student_part',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
  });
};
