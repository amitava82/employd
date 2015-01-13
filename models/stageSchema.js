"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var stageSchema = mongoose.Schema({
  name: String,
  category: {type: String, enum: ['un_screened', 'in_progress']},
  user: {type: ObjId, ref: 'User'},
  default: {type: Boolean, default: false},
  final: {type: Boolean, default: false}
});

module.exports = stageSchema;