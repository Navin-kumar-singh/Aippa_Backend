var mysql = require("mysql2");
const port = process.env.DBPORT
var mysqlcon = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  port: port || 3306,  
});

module.exports = {
  mysqlcon,
};
