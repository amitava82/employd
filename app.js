var path            = require("path");
var express         = require("express");
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
//var csrf            = require('csurf');
var cookieParser    = require("cookie-parser");
var session         = require("express-session");
var redis           = require('redis');
var RedisSessionStore = require('connect-redis')(session);
var compress        = require("compression");
//var helmet          = require('helmet');
var config          = require("config");
var db              = require("./lib/db");
var async           = require("async");
var multer          = require("multer");


global.config = config;
var models = global.models = require("./models");
var controllers = require("./controllers")(models);
var routes = require("./routes/routes");
var middleware = require("./routes/middleware")(models);

var app = express();
var port = process.env.PORT || 3000;

db.init(config.keys.mongodb.connectionString);

var sessionClient = redis.createClient(config.keys.redis.session.port, config.keys.redis.session.server);
sessionClient.auth(config.keys.redis.session.key);

async.parallel({
  redisClient: function (done) {
    sessionClient.select(config.keys.redis.session.db, done);
  }
}, function(err, results){
  if(err){
    throw err;
  }else{

    app.disable('x-powered-by');

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    // parse application/json
    app.use(bodyParser.json());
    //app.use(helmet.xframe());
    //app.use(helmet.iexss());
    //app.use(helmet.contentTypeOptions());
    //app.use(helmet.cacheControl());
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(session({
      store: new RedisSessionStore({
        ttl: config.keys.sessions.ttl,
        client: sessionClient
      }),
      resave: false,
      saveUninitialized: false,
      secret: config.keys.sessions.secret,
      key: config.keys.sessions.key,
      cookie: config.keys.sessions.cookie
    }));
//app.use(csrf());
    app.use(compress());
    app.use(express.static(path.join(__dirname, 'client')));
    app.use(multer({ dest: './uploads/'}));

    routes(app, controllers, middleware);

    app.listen(port, function(){
      console.log("express is running on ", port);
    });
  }
});
