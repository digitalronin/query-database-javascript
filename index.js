const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
const bookshelf = require('bookshelf')(db);

const Comment = bookshelf.model('Comment', {
  tableName: 'comments'
});

const User = bookshelf.model('User', {
  tableName: 'users',
  comments() {
    // by default, bookshelf infers that the foreign key is 'user_id'
    return this.hasMany('Comment');
  }
});

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const models = await new User()
      .fetchPage({
        pageSize: 5,
        page: 1,
        withRelated: ['comments']
      });

    users = [];

    models.map(m => {
      const user = m.attributes;
      const comments = m.related('comments');
      user.comments = comments.map(c => c.attributes);

      users.push(user);
    });

    const results = { 'users': users };
    res.render('pages/index', results );
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
