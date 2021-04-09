require('dotenv').config();
const   mysql           = require('mysql');

// const connection = mysql.createConnection({
//     host     : process.env.DB_HOST,
//     user     : process.env.DB_USERNAME,
//     password : process.env.DB_PASSWORD,
//     database : process.env.DB_NAME,
// 	autoReconnect:true
// });

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

module.exports = connection;