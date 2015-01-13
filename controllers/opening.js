var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var Opening = models.Opening,
      User = models.User,
      Organization = models.Organization;

  return {
    create: function (req, res) {

      Organization.findOne({_id: req.session.user.active_org._id}).lean().exec()
        .then(function(org){
          var opening = new Opening({
            title: req.body.title,
            description: req.body.description || req.body.title,
            organization: req.session.user.active_org._id,
            created_by: req.session.user.id
          });

          org.stages.forEach(function (i) {
            opening.stages.push(i);
          });

          return Opening.create(opening);
        })
        .then(function(result){
          output.success(res, result);
        }, function(err){
          output.error(res, err);
        });
    },

    update: function(req, res){

    },

    show: function(req, res){
      Opening.findOne({_id: req.params.id, organization: req.session.user.active_org._id})
        .populate({path: 'created_by', select: '-password -salt'})
        .exec()
        .then(function (opening) {
          return User.populate(opening, {
            path: 'stages.user'
          });
        })
        .then(function (opening) {
          output.success(res, opening);
        }, function(err){
          output.error(res, err);
        })
    },

    list: function (req, res) {
      Opening.find({organization: req.session.user.active_org._id})
        .lean()
        .populate('organization')
        .populate({path: 'created_by'})
        .exec()
        .then(function (openings) {
          output.success(res, openings);
        }, function (err) {
          output.error(res, err);
        });
    },

    delete: function (req, res) {

    }
  }
};