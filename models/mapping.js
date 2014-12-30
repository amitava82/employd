"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var MappingModel = function(){
  var mappingSchema = mongoose.Schema({
    orgId: {
      type: ObjId,
      ref: 'Organization',
      required: true
    },
    userId: {
      type: ObjId,
      ref: 'User',
      required: true
    },
    role: {
      type: Number,
      //ref: 'Role',
      required: true
    }
  });
  mappingSchema.plugin(timestamps);
  return mongoose.model('Mapping', mappingSchema);
};

module.exports = new MappingModel();