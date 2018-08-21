const express = require('express')
const router = express.Router()
const link_short = require('../services/link_short.js')
const bodyParser = require('body-parser')

const bluebird = require('bluebird')
const redis = bluebird.promisifyAll(require('redis'));

// const redis = require('redis')
const redisClient = redis.createClient()

//bluebird.promisifyAll(redis)

router.get('/', (req, res) => {
  redisClient.keysAsync('*').then((keys, err) => {
    if (err) {
      console.log(err)
    }
      return keys
  }).then((keys) => {
    var urlObjects = link_short.getUrlObjects((keys))
    return urlObjects
  }).then((urlObjects) => {
    res.render("shortner" , {
      urlObjects:urlObjects
    })
  })
})
router.post('/', (req, res) => {
  var link = req.body.og_link
  var key = "tye.ma/" + link_short.randomNameGen()
  //var count = "count:"
  //var keys = []
  //count += key
  //key = "url:" + key

  //redisClient.setnx(key, link)
  //redisClient.setnx(count, 0)
  if(link){
    redisClient.hset(key, 'url:', link)
    redisClient.hset(key, 'count:', "0")
    //console.log('heyhey')
  }



/*
  redisClient.hkeys("8O96Sp", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
});
*/
/*
  redisClient.get('url:tYUZyY', (res, err)=> {
    console.dir(res)
  })

  redisClient.mgetAsync(['url:tYUZyY','count:*']).then((result, err) => {
    if (err) {
      console.err(err)
    }
    console.log(result)
    return result
  });

  redisClient.mget(['url:tYUZyY','count:tYUZyY'], (err, result) => {
    console.dir(result)})
    */

/*
  redisClient.keysAsync(['url:*', 'count:*']).then((err, keys) => {
    console.log(keys)
  })

*/
/*
  redisClient.keysAsync('*').then((keys, err) => {
    if (err) {
      console.log(err)
    }
      return keys
  }).then((keys) => {
    var urlObjects = link_short.getUrlObjects((keys))
    return urlObjects
  }).then((urlObjects) => {
    console.log(urlObjects)
  })
*/
/*
var m = redisClient.multiAsync();
m.get('url:*');
m.get('count:*');
m.then(result => {
  console.log(result)
})
*/




  //console.log(allKeys)
  //console.log(keys)
  //console.log(link_short.keys)
  //redisClient.flushall()




  res.redirect('back')
})


module.exports = router
