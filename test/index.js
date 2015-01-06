var models = global.models = require("../models");
var db              = require("../lib/db");
var config          = require("config");

db.init("mongodb://admin:amitava@ds029051.mongolab.com:29051/funnel");


var Organization = models.Organization;
var User = models.User;

User.orgs('549ff2365f0b2755c2dda1ec').then(function(orgs){
  console.log(orgs);
  process.exit();
});

//
//
//Organization.aggregate(
//  {
//    $match: {
//      'users': {$elemMatch: {'user': "549ff2365f0b2755c2dda1ec"}}
//    }
//  },{
//    $unwind: "$users"
//  },
//  {
//    $project: {
//      _id: 1,
//      name: 1,
//      role: '$users.role'
//    }
//  }
//).exec(function(err, list){
//  console.log(JSON.stringify(list, null, 4))
//  process.exit()
//})
//
//Organization.find().elemMatch('users', {user: '549ff2365f0b2755c2dda1ec'}).exec(function(err, list){
//  console.log(JSON.stringify(list, null, 4))
//  process.exit()
//})
//Organization.find({'users.user': '549ff2365f0b2755c2dda1ec'}, {"users.$": 1}).select('name users')
//  .exec(function(err, list){
//    console.log(JSON.stringify(list, null, 4))
//    process.exit()
//  })