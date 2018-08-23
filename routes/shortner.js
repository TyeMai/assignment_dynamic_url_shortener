const express = require('express')
const router = express.Router()
const functions = require('../services/functions')
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
    }).then(functions.getUrlObjects) //((keys) => {
    //return functions.getUrlObjects((keys)) //can return reidtly.
    //return urlObjects
    .then((urlObjects) => {
      console.log(urlObjects)
      res.render("shortner", {
        urlObjects: urlObjects
      })
    })
})


router.get('/:code', (req, res) => {
  //var pathname = req.params.shortLink
  var code = req.params.code

  //console.log(pathname)
  //console.log(key)

  //var http = require("http");
  //var url = require("url");

  //so this will pop out the target url.



  //  http.createServer(function(req, res) {
  //  var pathname = url.parse(req.url).pathname;
  //res.writeHead(301,{Location: 'http://new-website.com/' + pathname});
  //res.writeHead(301,{Location: pathname});
  //  res.end();
  //  }).listen(8888);

  //console.log(code)

  redisClient.hgetAsync(code, 'url:').then((data) => {
    //console.log(data)
    if (data) {
      res.redirect("http://" + data)
      redisClient.hincrby([code, "count:", '1'])
    }
  })
})

router.post('/', (req, res) => {
  var link = req.body.og_link
  var key = functions.randomNameGen()
  //var count = "count:"
  //var keys = []
  //count += key
  //key = "url:" + key

  //redisClient.setnx(key, link)
  //redisClient.setnx(count, 0)

  if (link) {
    //link = "localhost:4290/" + link
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

  //redisClient.flushall()

  res.redirect('back')
})
/*
function initElement() {
  var p = document.getElementById("foo");
  // : showAlert(); or showAlert(param); will NOT work here.
  // Must be a reference to a function name, not a function call.
  p.onclick = showAlert;
};
*/
module.exports = router
