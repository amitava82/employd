"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var RoleModel = function(){
  var roleSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  });
  roleSchema.plugin(timestamps);
  return mongoose.model('Organization', roleSchema);
};

module.exports = new RoleModel();