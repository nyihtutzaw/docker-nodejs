const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;


// Set up Sequelize
const sequelize = new Sequelize('teams', 'root', 'password', {
  dialect: 'mysql',
  host: '172.23.0.2',
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
