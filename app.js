const express = require('express');
const { promisify } = require('util');
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./database/index.js");
const User = require("./models/model.user.js");
const { REDIS_URL, REDIS_PORT } = require('./config');
const redisClient = require("./redis");
const UserCache=require("./caches/cache.user.js");


// Sync the models with the database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

(async () => {
  await redisClient.connect();
})();

redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('error', (err) => console.log('Redis Client Connection Error', err));

app.use(express.json());

// Set up routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get("/users", UserCache, async (req, res) => {
  try {
    const cacheKey = `users`;
    const users = await User.findAll({});
    await redisClient.set(cacheKey, JSON.stringify(users), {
      EX: 1000,
      NX: true
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post("/user", async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await User.create({ name, email, phone });
  res.json(result).status(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


