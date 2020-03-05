const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
const { Model } = require('objection');
Model.knex(db);

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }
}

class User extends Model {
  static get tableName() {
    return 'users';
  }

  fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  static get relationMappings() {
    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          to: 'comments.user_id'
        }
      }
    };
  }
}

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const users = await User.query().limit(5).withGraphFetched('comments');
    const results = { 'users': users };
    res.render('pages/index', results );
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
