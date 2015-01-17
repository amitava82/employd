"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;
var when = require('when');

var OrganizationModel = function(){

  var defaultStages = [{
    name: 'Screening',
    category: 'un_screened',
    default: true
  }, {
    name: 'Telephonic',
    category: 'in_progress'
  }, {
    name: 'Face to Face',
    category: 'in_progress'
  }, {
    name: 'HR Round',
    category: 'in_progress',
    final: true
  }];

  var userPermission = mongoose.Schema({
    user: {type: ObjId, ref: 'User', required: true},
    role: {type: String, required: true, enum: ['admin', 'hr', 'user']}
  },{ _id : false });

  var stageSchema = mongoose.Schema({
    name: String,
    category: {type: String, enum: ['un_screened', 'in_progress']},
    user: {type: ObjId, ref: 'User'},
    default: {type: Boolean, default: false},
    final: {type: Boolean, default: false}
  });

  var organizationSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    owner: {
      type: ObjId,
      ref: 'User',
      required: true
    },
    users: [userPermission],
    stages: [stageSchema]
  });

  organizationSchema.index('users.user');

  organizationSchema.statics.createOrg = function(name, owner, callback){
    var org = new this({name: name, owner: owner});
    org.users.push({user: owner, role: 'admin'});

    defaultStages.forEach(function(i){
      i.user = owner;
      org.stages.push(i);
    });
    var d = when.defer();
    org.save(function (err, resp) {
      if(err){
        d.reject(err);
      }else{
        d.resolve(resp);
      }
      callback && callback(err, resp);
    });
    return d.promise;
  };

  organizationSchema.statics.addUser = function (orgId, userId, role, callback) {
    return this.findOne({_id: orgId}).exec()
      .then(function (org) {
        if(!org) throw new Error('NotFound');

        org.users.push({user: userId, role: role});

        var d = when.defer();
        org.save(function(err, org){
          if(err){
            d.reject(err);
          }else{
            d.resolve(org);
          }
          callback && callback(err, org);
        });
        return d.promise;
      });
  };

  organizationSchema.plugin(timestamps);
  return mongoose.model('Organization', organizationSchema);
};

module.exports = new OrganizationModel();