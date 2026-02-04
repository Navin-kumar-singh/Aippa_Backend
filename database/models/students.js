// const { min } = require("moment/moment");
// const Sequelize = require("sequelize");
// module.exports = function (sequelize, DataTypes) {
//   return sequelize.define(
//     "students",
//     {
//       id: {
//         autoIncrement: true,
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//       },
//       first_name: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       middle_name: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       last_name: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       bio: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       father_name: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       instituteId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: "institutions",
//           key: "id",
//         },
//       },
//       address: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       district: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       state: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       pincode: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },
//       email: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       contact: {
//         type: DataTypes.BIGINT,
//         allowNull: true,
//       },
//       resume: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       status: {
//         type: DataTypes.ENUM,
//         allowNull: true,
//         values: ["active", "pending", "inactive", "deleted", "verified"],
//         defaultValue: "inactive",
//       },
//       password: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       profile: {
//         type: DataTypes.CHAR(250),
//         allowNull: true,
//       },
//       banner: {
//         type: DataTypes.CHAR(250),
//         allowNull: true,
//       },
//       dob: {
//         type: DataTypes.DATEONLY,
//         allowNull: true,
//       },
//       gender: {
//         type: DataTypes.STRING(100),
//         allowNull: true,
//       },
//       fb: {
//         type: DataTypes.STRING(400),
//         allowNull: true,
//         defaultValue: "",
//       },
//       twitter: {
//         type: DataTypes.STRING(400),
//         allowNull: true,
//         defaultValue: "",
//       },
//       insta: {
//         type: DataTypes.STRING(400),
//         allowNull: true,
//         defaultValue: "",
//       },
//       lkd: {
//         type: DataTypes.STRING(400),
//         allowNull: true,
//         defaultValue: "",
//       },
//       ytb: {
//         type: DataTypes.STRING(400),
//         allowNull: true,
//         defaultValue: "",
//       },
//       role: {
//         type: DataTypes.ENUM,
//         allowNull: true,
//         values: ["student", "teacher", "coordinator", "institute-coordinator"],
//         defaultValue: "student",
//       },
//       permission: {
//         type: DataTypes.STRING(5000),
//         allowNull: true,
//       },
//       class: {
//         type: DataTypes.INTEGER(2),
//         validate: {
//           min: 1,
//           max: 12
//         }
//       },
//       parentEmail: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//     },
//     {
//       sequelize,
//       tableName: "students",
//       timestamps: true,
//       indexes: [
//         {
//           name: "PRIMARY",
//           unique: true,
//           using: "BTREE",
//           fields: [{ name: "id" }],
//         },
//         {
//           name: "instituteId",
//           using: "BTREE",
//           fields: [{ name: "instituteId" }],
//         },
//       ],
//     }
//   );
// };

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "students",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      father_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      contact: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 10],
        },
      },

      password: {
        type: DataTypes.TEXT,
        allowNull: false, // REQUIRED for register
      },

      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },

      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "institutions",
          key: "id",
        },
      },

      status: {
        type: DataTypes.ENUM(
          "active",
          "pending",
          "inactive",
          "deleted",
          "verified"
        ),
        defaultValue: "inactive",
      },

      role: {
        type: DataTypes.ENUM(
          "student",
          "teacher",
          "coordinator",
          "institute-coordinator"
        ),
        defaultValue: "student",
      },

      class: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 12,
        },
      },

      parentEmail: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      address: DataTypes.TEXT,
      district: DataTypes.STRING(100),
      state: DataTypes.STRING(100),
      pincode: DataTypes.INTEGER,

      bio: DataTypes.TEXT,
      resume: DataTypes.TEXT,
      profile: DataTypes.STRING(250),
      banner: DataTypes.STRING(250),

      fb: { type: DataTypes.STRING(400), defaultValue: "" },
      twitter: { type: DataTypes.STRING(400), defaultValue: "" },
      insta: { type: DataTypes.STRING(400), defaultValue: "" },
      lkd: { type: DataTypes.STRING(400), defaultValue: "" },
      ytb: { type: DataTypes.STRING(400), defaultValue: "" },

      permission: DataTypes.STRING(5000),
    },
    {
      tableName: "students",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["instituteId"],
        },
      ],
    }
  );
};
