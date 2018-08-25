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
      }).then(functions.getUrlObjects) //((keys) => {
      //return functions.getUrlObjects((keys)) //can return reidtly.
      //return urlObjects
      .then((urlObjects) => {
        //console.log(urlObjects)
        res.render("shortner", {
          urlObjects: urlObjects
        })
      })
  })


  router.get('/:code', (req, res) => {
    var code = req.params.code
    let io = req.app.locals.io

    //console.log(code)
    //console.log(pathname)
    //console.log(key)

    //var http = require("http");
    //var url = require("url");


    //console.log(code)
    /*
    var visit = 10
    io.on("connection", client => {
      // i dont know where id get the client.code from
      console.log('websockets yeay!')
      redisClient.hgetAsync(code, "count:").then((err, count) => {
        console.log(count)
        //io.emit("new visit", count)
        client.emit("new visit", visit);
      });

      //client.on("new visit", () => {
        //redisClient.hincr(['key', 'count'], (err, count) => {
          //io.emit("new count", count + code);
        //});
      });
  */
redisClient.hincrbyAsync([code, "count", '1']).then(result => {
    redisClient.hgetallAsync(code).then((data) => {
      //console.log(data)
      if (data) {
          io.emit('new visit', data)

        res.redirect("http://" + data.url)
      }
    })
  })
  });
  /*
    var visit = 10
    io.on("connection", client => {
      // i dont know where id get the client.code from
      console.log('websockets yeay!')
      redisClient.hgetAsync(code, "count:").then((err, count) => {
        console.log(count)
        //io.emit("new visit", count)
        client.emit("new visit", visit);
      });

      //client.on("new visit", () => {
        //redisClient.hincr(['key', 'count'], (err, count) => {
          //io.emit("new count", count + code);
        //});
      });

  */
  router.post('/', (req, res) => {
    var link = req.body.og_link
    var key = functions.randomNameGen()
    if (link) {
      redisClient.hset(key, 'url', link)
      redisClient.hset(key, 'count', "0")
      redisClient.hset(key, 'code', key)
    };



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
