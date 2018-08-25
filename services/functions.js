const app = require('express')();
const redis = require('redis');
const bluebird = require('bluebird');
const redisClient = bluebird.promisifyAll(redis.createClient());
const functions = {};


functions.randomNameGen = () => {
  var randomCharStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKJLMNOPQRSTUVWXYZ0123456789'
  var randomCode = ''
  for (var i = 0; i < 6; i++) {
    randomCode += randomCharStr[Math.floor(Math.random() * randomCharStr.length)]
  }
  return randomCode
}


functions.buildShortUrl = (code, full) =>{
  if(full){
    return 'http://tye.ma/' + code
    //return code
  }

  return "tye.ma/" + code
}

functions.getUrlObjects = (codes) => {
  return new Promise((resolve, reject) => {
    var urlRequestPromises = [];
    for (let code of codes) {
      urlRequestPromises.push(Promise.resolve(
        redisClient.hgetallAsync(code).then((hashData) => {
          return {
            shortUrl: functions.buildShortUrl(code),
            targetUrl: hashData.url,
            count: hashData.count,
            id: code
          };
        })));
    }
    Promise.all(urlRequestPromises).then((urlObjects) => {
      resolve(urlObjects);
    });
  });
};

/*
functions.getUrlObjects = () => {
  var urlKeys = []
  redisClient.keysAsync('*').then((keys, err) => {
    if (err) {
      console.log(err)
    }
    return keys
  }).then((keys) => {
    var urlObjects = []
    for (let key of keys) {
      if (key.slice(0, 3) === 'url') {
        urlKeys.push(key)
      }
    }
    return urlKeys
  }).then((urlKeys)=>{
    for (let key of urlKeys){
      redisClient.getAsync(urlKeys)
    }

  } )
        redisClient.getAsync(urlKeys).then((urlData) => {
          var urlObject = {
            code: key.slice(5),
            url: urlData,
            count: 0
          }
          urlObjects.push(urlObject)
        })

    }
  }).then(()=>{
    var urlObjects = link_short.getUrlObjects((keys))
    return urlObjects

  })

}
*/

module.exports = functions
