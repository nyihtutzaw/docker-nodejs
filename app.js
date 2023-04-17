// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const UserCache = require('./caches/cache.user');
const sequelize = require('./database/index');
const User = require('./models/model.user');
const redisClient = require('./redis');

// Sync the models with the database
sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Database synced');
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Error syncing database:', error);
});

(async () => {
  await redisClient.connect();
})();

// eslint-disable-next-line no-console
redisClient.on('connect', () => console.log('Redis Client Connected'));
// eslint-disable-next-line no-console
redisClient.on('error', (err) => console.log('Redis Client Connection Error', err));

app.use(express.json());
app.use(cors());

// Set up routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/users', UserCache, async (req, res) => {
  try {
    const cacheKey = 'users';
    const users = await User.findAll({});

    if (users.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(users), {
        EX: 1000,
        NX: true,
      });
    }

    res.json({ data: users });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/user', async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await User.create({ name, email, phone });
  res.json(result).status(200);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
