const app = require('express')();
const redis = require('redis');
const bluebird = require('bluebird')
const redisClient = bluebird.promisifyAll(redis.createClient())
const functions = {}


//bluebird.promisifyAll(redis)


/*
app.post('/', (req,res) => {
  var link = req.body.link
  // break up link and then mradomize

})
*/
functions.randomNameGen = () => {
  var randomCharStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKJLMNOPQRSTUVWXYZ0123456789'
  var randomKey = ''
  for (var i = 0; i < 6; i++) {
    randomKey += randomCharStr[Math.floor(Math.random() * randomCharStr.length)]
  }
  return randomKey
}
/*
functions.idNum = 0
functions.id = () => {
  functions.idNum = functions.idNum++
}
*/

functions.processKeys = (keys) => {

  functions.keys = keys
  //console.log(keysPro)
  //return keysPro
  console.log(functions.keys)
}

functions.getUrlObjects = (keys) => {
  return new Promise((resolve) => {


  var urlObjects = []
  for (let key of keys) {
    if (key.slice(0, 3) === 'url') {
      redisClient.getAsync(key).then((urlData) => {
        var urlObject = {
          code: key.slice(5),
          url: urlData,
          count: 0
        }
        urlObjects.push(urlObject)
        //console.log(urlObjects)
      })
    }
  }
  resolve(urlObjects)
  })
}
module.exports = functions
