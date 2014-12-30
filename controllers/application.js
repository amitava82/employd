var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function (models) {
  var Application = models.Application;
  var User = models.User;

  return {
    create: function(req, res){
      Application.create({
        organization: req.session.user.org,
        candidate: req.body.candidate,
        opening: req.body.opening
      }, function(err, application){
        if(err)
          output.error(res, err);
        else
          output.success(res, application);
      })
    },

    list: function (req, res) {
      var query =  Application.find({organization: req.session.user.org});
      if(req.query.opening)
        query.where('opening').equals(req.query.opening);
      if(req.query.candidate)
        query.where('candidate').equals(req.query.candidate);

      query.populate('candidate opening');
      query.exec(function(err, list){
        if(err)
          output.error(res, err);
        else
          output.success(res, list);
      });
    },

    show: function (req, res) {
      Application.findOne({organization: req.session.user.org, _id: req.params.id})
        .populate('candidate opening')
        .exec(function(err, application){
          if(err)
            output.error(res, err);
          else{
            User.populate(application, {
              path: 'opening.stages.users',
              select: '-password -salt'
            }, function(err, resp){
              if(err)
                output.error(res, err);
              else
                output.success(res, resp);
            })
          }
        });
    }
  }
};