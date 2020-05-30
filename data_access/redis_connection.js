const Redis = require('ioredis');

let redis = null;

function getRedisClient(){
    
  if(!redis){
    redis = new Redis();
  }

  return redis;
}

module.exports = {getRedisClient}
    



