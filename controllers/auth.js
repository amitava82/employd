var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');

module.exports = function(models){

  var User = models.User;
  var Organization = models.Organization;
  var Invite = models.Invite;
  var Mapping = models.Mapping;


  return {
    login: function(req, res){

      User.findOne({email: req.body.email}, function(err, user){
        if(user){
          var passObj = utilities.encryptPassword(req.body.password, user.salt);
          if(user.password !== passObj.password){
            res.status(401).send({error: "AuthorizationError", message: "Invalid credentials"});
          }else{
            //TODO org
            if(user.org.id){
              req.session.user = user;
              req.session.auth = true;
              res.redirect('/app');
            }else if(!user.org.id && user.organizations.length){
              user.org =  user.organizations[0].orgId;
              user.save(function(err){
                if(err)
                  output.error(res, err);
                else{
                  req.session.user = user;
                  req.session.auth = true;
                  res.redirect('/app');
                }
              });
            }else{
              res.redirect('/setup');
            }
          }
        }else{
          res.status(404).send(err);
        }
      });
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
          User.create(newUser, function(err, user){
            if(err){
              res.status(400).send(err);
            }else{
              var org = new Organization();
              org.name = req.body.company;
              org.owner = user._id;
              org.users.push(user._id);

              org.save(function(err, org){
                if(org){
                  Mapping.create({orgId: org._id, userId: user._id, role: 1}, function(err, role){
                    res.send(200, role);
                  })
                }
              });
            }

          });
        }
      });
    }
  }
};