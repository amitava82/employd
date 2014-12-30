"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var OpeningModel = function(){

  var stageSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    users: [{type: ObjId, ref: 'User'}],
    feedbacks: [],
    complete: {type: Boolean, default: false}
  });

  var openingSchema = mongoose.Schema({
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
    stages: [stageSchema]

  });

  //openingSchema.method('add')

  openingSchema.plugin(timestamps);
  return mongoose.model('Opening', openingSchema);
};

module.exports = new OpeningModel();