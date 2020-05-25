let redis = require('redis');
const redisClient = redis.createClient();

function getRedisClient(){
    return redisClient;
}

module.exports = {getRedisClient}
    



