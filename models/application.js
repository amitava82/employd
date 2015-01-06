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
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  var feedbackSchema = mongoose.Schema({
    stage_id: {type: ObjId},
    user: {type: ObjId, ref: 'User'},
    selected: Boolean,
    comment: String
  });

  var stageSchema = mongoose.Schema({
    name: String,
    category: {type: String, enum: ['un_screened', 'in_progress', 'completed']},
    user: {type: ObjId, ref: 'User'},
    position: Number
  });

  var logSchema = mongoose.Schema({

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
    assigned_to: {type: ObjId, ref: 'User', required: true},
    created_by: {type: ObjId, ref: 'User', required: true},
    notes: [noteSchema],
    feedbacks: [feedbackSchema],
    current_stage: {type: ObjId, required: true}
  });
  applicationSchema.index({candidate: 1, opening: 1, organization: 1}, {unique: true});
  applicationSchema.plugin(timestamps);

  return mongoose.model('Application', applicationSchema);
};

module.exports = new ApplicationModel();