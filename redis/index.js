const { REDIS_URL, REDIS_PORT } = require('./../config');
const redis = require('redis');
const redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

module.exports=redisClient;