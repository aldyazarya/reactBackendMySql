
const mysql = require ('mysql')

const conn = mysql.createConnection({
    user: 'aldyazarya',
    password: 'azarya1612',
    host: 'db4free.net',
    database: 'jc8expressmysql',
    port: '3306'
})

module.exports = conn

