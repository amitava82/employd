var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function (models) {
  var Application = models.Application;
  var User = models.User;
  var Organization = models.Organization;
  var Opening = models.Opening;

  return {
    create: function(req, res){

      Opening.findOne({_id: req.body.opening}).exec()
          .then(function(opening){

            if(!opening) throw new Error('NotFound');

            var stages = opening.stages;

            return Application.create({
              organization: req.session.user.org,
              candidate: req.body.candidate,
              opening: req.body.opening,
              assigned_to: stages[0].user,
              current_stage: stages[0].id
            });
          })
          .then(function(app){
            output.success(res, app);
          }, function(err){
            output.error(res, err);
          });
    },

    update: function(req, res){

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
          .populate({
            path: 'assigned_to',
            select: '-password -salt'
          })
          .exec()
          .then(function(application){
            if(!application) throw new Error('NotFound');

            return User.populate(application, {
              path: 'opening.stages.user',
              select: '-password -salt'
            });
          })
          .then(function(resp){
            output.success(res, resp);
          }, function(err){
            output.error(res, err);
          }).end();
    },

    reAssignUser: function (req, res) {

    },

    addFeedback: function (req, res) {

    },

    updateFeedback: function (req, res) {

    },

    addNote: function (req, res) {

    },

    updateNote: function(req, res){

    },

    deleteNote: function(req, res){

    }
  }
};