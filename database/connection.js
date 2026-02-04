// /* Sequalize connection details */


// const { Sequelize } = require("sequelize");
// const logger = require("../utils/utils");
// const dotenv = require('dotenv');
// dotenv.config({
//   path:'./.env.development'
// })
// const dbPort = process.env.DBPORT || 3306;
// const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
//   host: process.env.DBHOST,
//   dialect: "mysql",
//   logging: false,
//   port: dbPort,
// });
// (async function runSquelize() {
//   try {
//     await sequelize.authenticate();
//     logger.success("Sequelize Connection Has Been Established Successfully.");
//   } catch (error) {
//     logger.info(process.env.DBNAME);
//     logger.error("Unable to connect to the database:", error);
//   }
// })();

// module.exports = sequelize;




const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔍 Sequelize Database Configuration:');
console.log('Host:', process.env.DBHOST);
console.log('User:', process.env.DBUSER);
console.log('Database:', process.env.DBNAME);
console.log('Port:', process.env.DBPORT || 3306);

const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    port: process.env.DBPORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize: MySQL Database connected successfully!');
    console.log('📊 Connected to database:', process.env.DBNAME);
  })
  .catch(err => {
    console.error('❌ Sequelize: Unable to connect to database');
    console.error('Error:', err.message);
    if (err.original) {
      console.error('Original Error:', err.original.message);
      console.error('Error Code:', err.original.code);
    }
  });

module.exports = sequelize;