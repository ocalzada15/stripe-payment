var mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kiler77@',
  database: 'where_to'
})
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!')
})

module.exports = { connection }