
const mysql = require ('mysql')

const conn = mysql.createConnection({
    user: 'devuser',
    password: 'mysql123',
    host: 'localhost',
    database: 'jc8expressmysql',
    port: '3306'
})

module.exports = conn

