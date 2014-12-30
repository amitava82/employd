var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var User = models.User;

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
      User.findOne({_id: req.params.id, organization: req.session.user.org}, '-password -salt', function(err, resp){
        if(err){
          output.error(res, err);
        }else{
          output.success(res, resp);
        }
      });
    },

    list: function (req, res) {
      User.find({'organizations.orgId': req.session.user.org}, '-password -salt', function(err, list){
        if(err)
          output.error(res, err);
        else{
          output.success(res, list);
        }

      });
    },

    delete: function (req, res) {

    }
  }
};