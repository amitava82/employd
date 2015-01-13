var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');
var fs = require('fs-extra');
var when = require('when');
var path = require('path');

module.exports = function(models){
  var Candidate = models.Candidate;
  var Application = models.Application;
  var Opening = models.Opening;

  return {
    create: function (req, res) {

      var candidate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        telephone: req.body.telephone,
        source: req.body.source,
        resumeText: req.body.resumeText,
        organization: req.session.user.active_org._id,
        created_by: req.session.user.id
      };

      if(req.files.resume){
        candidate.fileName = req.files.resume.name;
      }
      Candidate.create(candidate)
        .then(function (c) {
          var defer = when.defer();

          if(candidate.fileName){
            var dest = path.join(config.storage.path, req.session.user.active_org._id, candidate.fileName);
            fs.move(req.files.resume.path, dest, {clobber: false}, function(err){
              defer.resolve(c);
            });
          }else{
            defer.resolve(c);
          }
          return defer.promise;
        })
        .then(function (c) {
          output.success(res, c);
        }, function (err) {
          output.error(res, err);
        }).end();
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

    },

    file: function (req, res) {
      var filepath = path.join(config.storage.path, req.session.user.active_org._id, req.params.file);
      if(fs.existsSync(filepath)){
        res.download(filepath);
      }else{
        res.send(404, {error: 'NotFound'});
      }
    }
  }
};