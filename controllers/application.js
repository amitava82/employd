var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');
var when = require('when');

module.exports = function (models) {
  var Application = models.Application;
  var User = models.User;
  var Organization = models.Organization;
  var Opening = models.Opening;
  var Candidate = models.Candidate;

  return {
    create: function(req, res){

      Opening.findOne({_id: req.body.opening}).exec()
          .then(function(opening){

            if(!opening) throw new Error('NotFound');

            var stages = opening.stages;

            return Application.create({
              organization: req.session.user.active_org._id,
              candidate: req.body.candidate,
              opening: req.body.opening,
              assigned_to: stages[0].user,
              current_stage: stages[0].id,
              created_by: req.session.user.id
            });
          })
        .then(function (app) {
          return Candidate.findOneAndUpdate({_id: req.body.candidate}, {$push: {applications: app.id}})
            .exec()
            .then(function(){
              output.success(res, app);
            })
        })
        .then(null, function(err){
          output.error(res, err);
        });
    },

    update: function(req, res){
      var self = this;
      var updateObj = {};

      var assignedUser = req.body.assigned_to;
      var current_stage = req.body.current_stage;

      Application.findOne({_id: req.params.id})
        .populate('opening')
        .exec()
        .then(function(application){
          if(!application) throw new Error('NotFound');

          if(assignedUser) application.assigned_to = assignedUser;
          if(current_stage){
            var _stage = _.find(application.opening.stages, {id: current_stage});
            if(!_stage) throw new Error('NotFound');

            application.current_stage = current_stage;
            assignedUser = assignedUser || _stage.user;
          }

          var d = when.defer();
          application.save(function(err, app){
            if(err) d.reject(err);
            else d.resolve(app)
          });

          return d.promise;
        })
        .then(function (app) {
          self.show(req, res);
        }, function (err) {
          output.error(res,err);
        })

    },

    list: function (req, res) {
      var query =  Application.find({organization: req.session.user.active_org._id});
      if(req.query.opening)
        query.where('opening').equals(req.query.opening);
      if(req.query.candidate)
        query.where('candidate').equals(req.query.candidate);
      if(req.query.created_by)
        query.where('created_by').equals(req.query.created_by);
      if(req.query.assigned_to)
        query.where('assigned_to').equals(req.query.assigned_to);
      //if(req.query.scheduled)
        //query.where
      query.populate('candidate opening');
      query.exec(function(err, list){
        if(err)
          output.error(res, err);
        else
          output.success(res, list);
      });
    },

    show: function (req, res) {
      Application.findOne({organization: req.session.user.active_org._id, _id: req.params.id})
          .populate('candidate opening')
          .populate({
            path: 'assigned_to',
            select: '-password -salt'
          })
          .exec()
          .then(function(application){
            if(!application) throw new Error('NotFound');

            return User.populate(application, {
              path: 'opening.stages.user notes.user',
              select: '-password -salt'
            });
          })
          .then(function(resp){
            output.success(res, resp);
          }, function(err){
            output.error(res, err);
          }).end();
    },

    addFeedback: function (req, res) {

    },

    updateFeedback: function (req, res) {

    },

    addNote: function (req, res) {
      var d = when.defer();
      Application.findOne({_id: req.params.id}).exec()
        .then(function(app){
          if(app){
            app.notes.push({user: req.session.user.id, note: req.body.note});
            app.save(function(err, doc){
              if(err)
                d.reject(err);
              else
                d.resolve(doc);
            });
            return d.promise;
          }else{
            throw new Error("NotFound");
          }
        })
        .then(function (doc) {
          return User.populate(doc, {
            path: 'notes.user',
            select: '-password -salt'
          });

        })
        .then(function(doc){
          output.success(res, doc);
        }, function (err) {
          output.error(res, err);
        }).end();

    },

    updateNote: function(req, res){

    },

    deleteNote: function(req, res){

    },

    reassign: function (req, res) {
      var assignedUser = req.body.assigned_to;

      //TODO check permission
      Application.findByIdAndUpdate({_id: req.params.id, assigned_to: assignedUser}).exec()
        .then(function (app) {
          output.success(res, app);
        }, function (err) {
          output.error(res, err);
        })

    }
  }
};