const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING }
}, {
  tableName: 'users',
  timestamps: false
});

const Comment = sequelize.define('Comment', {
  body: { type: DataTypes.STRING }
}, {
  tableName: 'comments',
  timestamps: false
});

User.hasMany(Comment, { foreignKey: 'user_id' });

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => listUsers(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listUsers(req, res) {
  try {
    const users = await User.findAll({ include: Comment });
    const results = { 'users': users };
    res.render('pages/index', results );
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}
