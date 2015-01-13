var url = require("url");
var utilities = require("../lib/utilities");
var _ = require("lodash");
var config = global.config;
var output = require('../lib/output');
var when = require('when');
var uuid = require('uuid');

module.exports = function(models){

  var User = models.User;
  var Organization = models.Organization;
  var Invite = models.Invite;
  var Mapping = models.Mapping;

  function createUser(email, data, orgId){
    var passObj = utilities.encryptPassword(data.password);
    var newUser = {
      active_org: orgId,
      email: email,
      firstname: data.firstname,
      lastname: data.lastname,
      password: passObj.password,
      salt: passObj.salt
    };
    return User.create(newUser);
  }

  function createSession(req, user, orgs){
    var currentOrg = _.findWhere(orgs, {_id: user.active_org});
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      orgs: orgs,
      active_org: currentOrg
    };
    req.session.auth = true;
  }

  return {
    login: function(req, res){

      var _user = null;
      var promise = User.findOne({email: req.body.email}).select('+password +salt').exec();


      function handleError(error){
        output.error(res, error);
      }

      promise.then(function(user){
        if(!user) throw new Error('NotFound');

        _user = user;
        var passObj = utilities.encryptPassword(req.body.password, user.salt);
        if(user.password !== passObj.password)
          throw new Error("AuthorizationError");
        else if(user.active_org){
          return User.orgs(user.id);
        }else{
          return User.orgs(user.id)
            .then(function(orgs){

              if(!orgs.length) throw new Error('MissingOrgError');

              user.active_org = orgs[0]._id;
              var deferred = when.defer();
              user.save(function(err, user){
                if(err){
                  deferred.reject(err);
                }else{
                  deferred.resolve(user);
                }
              });
              return deferred.promise;
            });
        }
      }).then(function(orgs){
        createSession(req, _user, orgs);
        res.redirect('/app');

      }, handleError).end();
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
              });
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
      Invite.findOne({invite: req.params.invite}).lean().exec()
        .then(function(invite){
          if(!invite) throw new Error('NotFound');

          req.session.request_token = uuid.v4();

          if(invite.org){
            res.render('setup_account', {invite: invite.invite, request_token: req.session.request_token});
          }else{
            res.render("registration", {invite: invite.invite, request_token: req.session.request_token});
          }

        })
        .then(null, function (err) {
          res.render('error', {error: 'Invalid invitation. Your invite has expired or already been used.'});
        })
    },

    //This is admin account
    setupAccount: function(req, res){
      var _invite = null, _user = null;
      Invite.findOne({invite: req.params.invite}).exec()
        .then(function(invite){

            if(!invite) throw new Error('NotFound');
            if(req.session.request_token != req.body.request_token) throw new Error('InvalidRequest');

            _invite = invite;
            return createUser(invite.email, req.body);
        })
        .then(function(user){
          _user = user;
          return Organization.createOrg(req.body.company, user.id);
        })
        .then(function(org){
          return User.findOneAndUpdate({_id: _user.id, active_org: org.id}).exec();
        })
        .then(function (user) {
          _user = user;
          return Invite.findOneAndRemove({_id: _invite.id}).exec();
        })
        .then(function(){
          return User.orgs(_user.id);
        })
        .then(function (orgs) {
          createSession(req, _user, orgs);
          res.redirect('/app');
        }, function (error) {
          console.log(error);
          if(error.message == "InvalidRequest" || error.message == "NotFound"){
            res.render('error', {error: 'Invalid request'});
          }else{
            var data = {
              invite: _invite.invite,
              request_token: req.session.request_token,
              fields: req.body
            };
            if(_invite.org){
              res.render('setup_account', data);
            }else{
              res.render("registration", data);
            }
          }

        });
    },

    acceptInvite: function(req, res){
      var _invite = null, _user = null;
      Invite.findOne({invite: req.body.invite}).populate('org').exec()
        .then(function(invite){
          if(!invite) throw new Error('NotFound');
          if(req.session.request_token != req.body.request_token) throw new Error('InvalidRequest');
          _invite = invite;
          return createUser(_invite.email, req.body, _invite.org.id);
        })
        .then(function(user){
          _user = user;
          Organization.addUser(_invite.org, user.id, _invite.role, function (err, org) {
            var d = when.defer();
            if(err)
              d.reject(err);
            else
              d.resolve();
            return d.promise;
          })
        })
        .then(function () {
          return Invite.findOneAndRemove({_id: _invite.id}).exec();
        })
        .then(function(){
          return User.orgs(_user.id);
        })
        .then(function (orgs) {
          createSession(req, _user, orgs);
          res.redirect('/app');
        }, function (error) {
          var data = {
            invite: _invite.invite,
            request_token: req.session.request_token,
            fields: req.body,
            error: error.message
          };
          res.render('setup_account', data);
        })
    },

    switchOrg: function (req, res) {
      var orgId = req.params.id;
      User.orgs(req.session.user.id)
        .then(function(orgs){
        var org = _.find(orgs, function(i){
          return i._id.toString() == orgId;
        });
        if(org){
          return org;
        }else
          throw new Error('NotFound');
        })
        .then(function (org) {
          req.session.user.active_org = org;
          res.redirect('/app');
        }, function (err) {
          output.error(res, err);
        })
    }
  }
};