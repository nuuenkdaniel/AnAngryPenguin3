const mysql2 = require('mysql2');
const { dbPass } = require('./config.json');

module.exports = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'angrypenguinbot'
});
