const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const conn = new Pool({ connectionString: process.env.DATABASE_URL });

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const db = await conn.connect()
    const result = await db.query('SELECT * FROM users');
    const results = { 'users': (result) ? result.rows : null};
    res.render('pages/index', results );
    db.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
