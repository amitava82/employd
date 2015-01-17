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

  var scheduleSchema = mongoose.Schema({
    attendees: [{type: ObjId, ref: 'User', required: true}],
    start: {type: Date, required: true},
    end: {type: Date, required: true}
  });


  var stageSchema = mongoose.Schema({
    stage_id: {type: ObjId, required: true},
    user: {type: ObjId, ref: 'User', required: true},
    schedules: [scheduleSchema],
    feedback: String,
    status: {type: String, enum: ['selected', 'rejected']},
    completed: {type: Boolean, default: false}
  }, {_id: false});


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
    current_stage: {type: ObjId, required: true},
    stages: [stageSchema],
    archived: {type: Boolean, default: false},
    status: {type: String, enum: ['in_progress', 'selected', 'rejected'], default: 'in_progress'}
  });

  applicationSchema.index({candidate: 1, opening: 1, organization: 1}, {unique: true});
  applicationSchema.plugin(timestamps);

  return mongoose.model('Application', applicationSchema);
};

module.exports = new ApplicationModel();