const redisClient = require('../redis');

const UserCache = async (req, res, next) => {
  try {
    const cacheKey = 'users';
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const users = JSON.parse(cachedData);
      res.json({ data: users });
    } else {
      // If cache miss, continue to route handler
      next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = UserCache;
