var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var Candidate = models.Candidate;
  var Application = models.Application;
  var Opening = models.Opening;

  return {
    create: function (req, res) {
      Candidate.create(_.extend({organization: req.session.user.active_org._id}, req.body), function(err, opening){
        if(err)
          output.error(res, err);
        else
          output.success(res, opening);
      });
    },

    show: function(req, res){
      Candidate.findOne({_id: req.params.id, organization: req.session.user.active_org._id}, function(err, resp){
        if(err){
          output.error(res, err);
        }else{
          output.success(res, resp);
        }
      })
    },

    list: function (req, res) {
      Candidate.find({organization: req.session.user.active_org._id})
        .populate('applications')
        .exec()
        .then(function (list) {
          return Candidate.populate(list, {path: 'applications.opening', select: 'title',  model: 'Opening'});
        })
        .then(function(list){
          output.success(res, list)
        }, function (err) {
          output.error(res, err);
        }).end();
    },

    delete: function (req, res) {

    }
  }
};