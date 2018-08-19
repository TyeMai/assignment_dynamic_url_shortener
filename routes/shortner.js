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
  //keys = [{url:1, counter:2}, {url:3, counter:4}]

  //urlObjects: urlObjects
  res.render("shortner" ) //, {
  //  keys: keys
  //})

})

router.post('/', (req, res) => {
  var link = req.body.og_link
  var key = link_short.randomNameGen()
  var count = "count:"
  var keys = []
  count += key
  key = "url:" + key


  redisClient.keysAsync('*').then((keys, err) => {
    if (err) {
      console.log(err)
    }
    //console.log(keys)
    return keys
  }).then((keys) => {
    var urlObjects = link_short.getUrlObjects((keys))
    return urlObjects
  }).then((urlObjects)=>{
    console.log(urlObjects)
  })


  //console.log(allKeys)
  //console.log(keys)
  //console.log(link_short.keys)
  //redisClient.flushall()

  //keys.then(all => {
  //  console.log(all)
  //})




  res.redirect('back')
})


module.exports = router
