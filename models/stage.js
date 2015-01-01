"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var StageModel = function(){

  var stageSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    category: {type: String, enum: ['un_screened', 'in_progress', 'completed']},
    user: [{type: ObjId, ref: 'User'}]
  });


  //openingSchema.method('add')

  stageSchema.plugin(timestamps);


  return mongoose.model('Stage', stageSchema);
};

module.exports = new StageModel();