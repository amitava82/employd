"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var OpeningModel = function(){

  var stageSchema = mongoose.Schema({
    name: String,
    category: {type: String, enum: ['un_screened', 'in_progress', 'completed']},
    user: {type: ObjId, ref: 'User'},
    position: Number
  });

  var openingSchema = mongoose.Schema({
    created_by: {
      type: ObjId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    organization: {
      type: ObjId,
      ref: 'Organization',
      required: true
    },
    archived: {type: Boolean, default: false},
    stages: [stageSchema]

  });


  openingSchema.plugin(timestamps);

  return mongoose.model('Opening', openingSchema);
};

module.exports = new OpeningModel();