"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var OrganizationModel = function(){
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
    users: [{type: ObjId, ref: 'User'}]
  });
  organizationSchema.plugin(timestamps);
  return mongoose.model('Organization', organizationSchema);
};

module.exports = new OrganizationModel();