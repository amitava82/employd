var models = global.models = require("../models");
var db              = require("../lib/db");
var config          = require("config");

db.init("mongodb://admin:amitava@ds029051.mongolab.com:29051/funnel");


var Organization = models.Organization;

Organization.createOrg('My stupid org', '549ff2365f0b2755c2dda1ec', function (err, doc) {
  console.log(err);
});