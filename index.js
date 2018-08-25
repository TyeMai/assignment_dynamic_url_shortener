const express = require('express');
const app = express();
const redis = require('redis');
const bluebird = require('bluebird');

const redisClient = bluebird.promisifyAll(redis.createClient())
const exphbs = require('express-handlebars');
const functions = require("./services/functions");
const shortner = require('./routes/shortner');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const hbs = exphbs.create({
  defaultLayout: 'main'
});

app.locals.io = io

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.engine("handlebars", hbs.engine);
app.set('view engine', "handlebars");

app.use(bodyParser.urlencoded({
  extended: true
}));




app.use('/', shortner);

/*
io.on("connection", client => {
  // i dont know where id get the client.code from
  //redisClient.hget([client.code, "count"], (err, count) => {
  let count = 10
    client.emit("new visit", count);
  //});

  client.on("new visit", () => {
    //redisClient.hincr(['key', 'count'], (err, count) => {
      io.emit("new count", count + code);
    //});
  });
});

*/

//change to server for websocket.
server.listen(4290, () => {
  console.log('im listening')
});

//app.listen(4290, () => {
//  console.log('redis uhg or yay!')
//})
