const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mysql = require('mysql2/promise');

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows, fields] = await conn.execute('SELECT * FROM users');
    const results = { 'users': rows };
    res.render('pages/index', results );
    await conn.end();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
