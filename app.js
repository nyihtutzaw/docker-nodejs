const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { MYSQL_HOST, MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD } = require('./config');

const app = express();
const port = process.env.PORT || 3000;


// Set up Sequelize
const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD, {
  dialect: 'mysql',
  host: MYSQL_HOST,
  port: 3306,
});

// Define a model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the models with the database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

// Set up routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get("/teams",async (req,res)=>{
  const users=await User.findAll();
  res.json(users);
})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
