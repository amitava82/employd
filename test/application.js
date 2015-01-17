var models = global.models = require("../models");
var db              = require("../lib/db");
var config          = require("config");

db.init("mongodb://admin:amitava@ds029051.mongolab.com:29051/funnel");

var Application = models.Application;


Application.update({_id: '54b26e2930209cad811de0ec', 'stages.stage_id': '54b26e2930209cad811de0ea'}, {$set: {
  'stages.$': {feedback: 'update'}
}}, {upsert: true}, function(err){
  console.log(err);
  process.exit();
})