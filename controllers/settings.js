var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

module.exports = function (models) {

  var Organization = models.Organization,
      Invite = models.Invite,
      User = models.User;

  return {

    users: function (req, res) {

    },

    inviteUser: function (req, res) {
      var _invite = null;
      Invite.findOne({email: req.body.email}).exec()
        .then(function (invite) {
          if(invite){
            _invite = invite;
            return invite;
          }else{
            return User.findOne({email: req.body.email}).exec()
              .then(function(user){
                if(user){
                  return Organization.findOne({'users.user': user.id}).exec();
                }
              })
              .then(function(org){
                if(org){
                  throw new Error('UserExists');
                }
              })
              .then(function(){
                var role = req.body.role || 'hr';
                return Invite.create({email: req.body.email, org: req.session.user.active_org._id, role: role, from: req.session.user._id});
              });
          }
        })
        .then(function (invite) {
          utilities.sendMail('signup-invite', {
            email: req.body.email,
            URL: url.format({hostname: config.urls.ui.host, port: config.urls.ui.port, protocol: config.urls.ui.protocol, pathname: "/confirm/"+invite.invite})
          }, function(status){
            output.success(res, {success:true});
          });
        }, function (err) {
          output.error(res, err);
        });
    }
  }
};