var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){
  var Opening = models.Opening;

  return {
    create: function (req, res) {
      var opening = new Opening({title: req.body.title, description: req.body.description, organization: req.session.user.org});
      opening.stages = req.body.stages;


      Opening.create(opening, function(err, opening){
        if(err)
          output.error(res, err);
        else
          output.success(res, opening);
      });
    },

    show: function(req, res){
      Opening.findOne({_id: req.params.id, organization: req.session.user.org}, function(err, resp){
        output.success(res, resp);
      });
    },

    list: function (req, res) {
      Opening.find({organization: req.session.user.org})
        .lean()
        .populate('organization stages.users ')
        .exec(function(err, list){
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