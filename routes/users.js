var express = require('express');

var router = express.Router();

var redisConn = require("../data_access/redis_connection")


/* GET users listing. */
router.get('/', function(req, res, next) {
  let redis = redisConn.getRedisClient();
  redis.set("some-value", 1);
  res.send('respond with a resource');
});

module.exports = router;
