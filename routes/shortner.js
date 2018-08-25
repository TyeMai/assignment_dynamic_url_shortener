const express = require('express')
const app = express()
const router = express.Router()
const functions = require('../services/functions')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const redis = bluebird.promisifyAll(require('redis'));
// const redis = require('redis')
const redisClient = redis.createClient()

//bluebird.promisifyAll(redis) //was createServer
//const server = require('http').createServer(app); //we normally dont have to create server with express.
//const io = require('socket.io')(server);



router.get('/', (req, res) => {
  redisClient.keysAsync('*').then((keys, err) => {
      if (err) {
        console.log(err)
      }
      return keys
    }).then(functions.getUrlObjects)

    .then((urlObjects) => {

      res.render("shortner", {
        urlObjects: urlObjects
      })
    })
})


router.get('/:code', (req, res) => {
  var code = req.params.code
  let io = req.app.locals.io

  redisClient.hincrbyAsync([code, "count", '1']).then(result => {
    redisClient.hgetallAsync(code).then((data) => {
      if (data) {
        io.emit('new visit', data)
        res.redirect("http://" + data.url)
      }
    })
  })
});

router.post('/', (req, res) => {
  var link = req.body.og_link
  var key = functions.randomNameGen()
  if (link) {
    redisClient.hset(key, 'url', link)
    redisClient.hset(key, 'count', "0")
    redisClient.hset(key, 'code', key)
  }
  //redisClient.flushall()
  res.redirect('back')
})




module.exports = router
