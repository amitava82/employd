"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var ApplicationModel = function(){

  var noteSchema = mongoose.Schema({
    user: {
      type: ObjId,
      required: true
    },
    note: {
      type: String,
      required: true
    }
  });

  var applicationSchema = mongoose.Schema({
    candidate: {
      type: ObjId,
      ref: 'Candidate',
      required: true
    },
    opening: {
      type: ObjId,
      ref: 'Opening',
      required: true
    },
    organization: {
      type: ObjId,
      ref: 'Organization',
      required: true
    },
    notes: [noteSchema],
    stage: {}
  });
  applicationSchema.index({candidate: 1, opening: 1, organization: 1}, {unique: true});
  applicationSchema.plugin(timestamps);
  return mongoose.model('Application', applicationSchema);
};

module.exports = new ApplicationModel();