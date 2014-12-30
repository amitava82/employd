"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var CandidateModel = function(){

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

  var candidateSchema = mongoose.Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    telephone: {
      type: Number,
      required: true,
      unique: true
    },
    source: String,
    resumeText: String,
    fileName: String,
    notes: [noteSchema],
    applications: [{type: ObjId, ref: 'Application'}],
    locked: {
      type: Boolean,
      default: false
    },
    organization:{type: ObjId, ref: "Organization", required: true}

  });
  candidateSchema.plugin(timestamps);
  return mongoose.model('Candidate', candidateSchema);
};

module.exports = new CandidateModel();