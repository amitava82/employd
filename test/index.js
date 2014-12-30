var models = global.models = require("../models");
var db              = require("../lib/db");
var config          = require("config");

db.init("mongodb://admin:amitava@ds029051.mongolab.com:29051/funnel");


var User = models.User;

var u = new User();

u.firstname = "test";
u.lastname = "stuff";
u.email = "stuff@test.com";
u.password = "dsad";
u.salt = "das";
u.organizations.push({orgId: "549c3275bde313ea1698d4a8", role: 1});

u.save();