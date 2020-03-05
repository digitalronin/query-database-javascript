const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const result = await db.select().from('users').limit(5).offset(5);
    const results = { 'users': (result) ? result : null};
    res.render('pages/index', results );
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
