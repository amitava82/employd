var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');
var when = require('when');

module.exports = function(models){

  var User = models.User;
  var Organization = models.Organization;
  var Invite = models.Invite;
  var Mapping = models.Mapping;


  return {
    login: function(req, res){

      var promise = User.findOne({email: req.body.email}).exec();


      function handleSuccess(user){
          req.session.user = user;
          req.session.auth = true;
          res.redirect('/app');
      }

      function handleError(error){
        output.error(res, error);
      }

      promise.then(function(user){
        if(!user) throw new Error('userNotFound');

        var passObj = utilities.encryptPassword(req.body.password, user.salt);
        if(user.password !== passObj.password)
          throw new Error("AuthorizationError");
        else if(user.org.id){
          return user;
        }else{
          return Organization.findOne({'users.user': user.id}).exec()
            .then(function(org){
              var u = _.find(org.users, function(u){
                return user.id == u.user.toString();
              });
              if(u){
                user.org = org.id;
                var deferred = when.defer();
                user.save(function(err, user){
                  if(err){
                    deferred.reject(err);
                  }else{
                    deferred.resolve(user);
                  }
                });
                return deferred.promise;
              }else{
                throw new Error('MissingOrgError');
              }
            });
        }
      }).then(handleSuccess, handleError);
    },

    signup: function (req, res) {
      User.findOne({email: req.body.email}, function(err, user){
        if(err){
          res.json(err);
        }else if(user){
          res.status(400).send({error: "UserExists"});
        }else{
          var newInvite = new Invite({email: req.body.email.toLowerCase()});
          newInvite.save(function(err, inv){
            if(err){
              res.json(err);
            }else{
              utilities.sendMail('signup-invite', {
                email: req.body.email,
                URL: url.format({hostname: config.urls.ui.host, port: config.urls.ui.port, protocol: config.urls.ui.protocol, pathname: "/confirm/"+newInvite.invite})
              }, function(status){
                res.send(200, "OK");
              })
            }
          });
        }
      });
    },

    signout: function (req, res) {
      req.session.destroy();
      res.redirect('/signin');
    },

    validateInvite: function(req, res){
      Invite.findOne({invite: req.params.invite}, function(err, invite){
        if(err){

        }else if(!invite){

        }else{
          res.render("registration");
        }
      });
    },

    setupAccount: function(req, res){
      Invite.findOne({invite: req.params.invite}, function(err, invite){
        if(invite){
          var passObj = utilities.encryptPassword(req.body.password);
          var newUser = {
            email: invite.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: passObj.password,
            salt: passObj.salt
          };

          User.create(newUser)
            .then(function(user){
              return Organization.createOrg(req.body.company, user.id, function(err, org){
                if(err){
                  throw err;
                }else{
                  output.success(res, user);
                }
              })
            }, function(err){
              output.error(res, err);
            })
        }
      });
    }
  }
};