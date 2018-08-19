const app = require('express')();
const redis = require('redis');
const exphbs = require('express-handlebars')
//const redisClinet = require.createClinet()
const link_short = require("./services/link_short")
const shortner = require('./routes/shortner')
const bodyParser = require('body-parser')
//const shortner = require('./routes/shortner.js')

const hbs = exphbs.create({
  defaultLayout: 'main'
});


app.engine("handlebars", hbs.engine);
app.set('view engine', "handlebars");

//app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', shortner)


app.listen(4290, () => {
  console.log('redis uhg or yay!')
})
