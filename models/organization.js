"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var OrganizationModel = function(){

  var defaultStages = [{
    name: 'Screening',
    category: 'un_screened',
    default: true,
    position: 0
  }, {
    name: 'Telephonic',
    category: 'in_progress',
    position: 1
  }, {
    name: 'Face to Face',
    category: 'in_progress',
    position: 2
  }, {
    name: 'HR Round',
    category: 'in_progress',
    position: 3
  }, {
    name: 'Hired',
    category: 'completed',
    position: 4
  }, {
    name: 'Rejected',
    category: 'completed',
    position: 5
  }];

  var userPermission = mongoose.Schema({
    user: {type: ObjId, ref: 'User', required: true},
    role: {type: String, required: true}
  });

  var stageSchema = mongoose.Schema({
    name: String,
    category: {type: String, enum: ['un_screened', 'in_progress', 'completed']},
    user: {type: ObjId, ref: 'User'},
    position: Number
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
    org.stages = defaultStages.map(function(i){
      i.user = owner;
      return i;
    });
    org.save(callback);
  };

  organizationSchema.plugin(timestamps);
  return mongoose.model('Organization', organizationSchema);
};

module.exports = new OrganizationModel();