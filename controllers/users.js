var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var User = models.User;
  var Application = models.Application;
  var Organization = models.Organization;

  return {
    create: function (req, res) {
      User.create({}, function(err, opening){
        if(err)
          output.error(res, err);
        else
          output.success(res, opening);
      });
    },

    show: function(req, res){
      User.findOne({_id: req.params.id, organization: req.session.user.active_org._id}, function(err, resp){
        if(err){
          output.error(res, err);
        }else{
          output.success(res, resp);
        }
      });
    },

    list: function (req, res) {
      Organization.findOne({_id: req.session.user.active_org._id}).select('users').populate('users.user').lean().exec()
        .then(function (org) {
          var users = _.map(org.users, function(u){
            var user = u.user;
            user.role = u.role;
            return user;
          });
          output.success(res, users);
        }, function(err){
          output.error(res, err);
        });
    },

    delete: function (req, res) {

    }
  }
};