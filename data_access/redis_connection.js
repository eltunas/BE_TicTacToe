let redis = null;


function getRedisClient(){
    
  if(redis){
    const Redis = require('ioredis');

    redis = new Redis();
  }

  return redis;
}

module.exports = {getRedisClient}
    



