var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var Candidate = models.Candidate;

  return {
    create: function (req, res) {
      Candidate.create(_.extend({organization: req.session.user.org}, req.body), function(err, opening){
        if(err)
          output.error(res, err);
        else
          output.success(res, opening);
      });
    },

    show: function(req, res){
      Candidate.findOne({_id: req.params.id, organization: req.session.user.org}, function(err, resp){
        if(err){
          output.error(res, err);
        }else{
          output.success(res, resp);
        }
      })
    },

    list: function (req, res) {
      Candidate.find({organization: req.session.user.org}, function(err, list){
        if(err)
          output.error(res, err);
        else
          output.success(res, list);
      });
    },

    delete: function (req, res) {

    }
  }
};