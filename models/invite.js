"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uuid = require('uuid');

var InviteModel = function(){
  var inviteSchema = mongoose.Schema({
      invite: {
        type: String,
        required: true,
        unique: true,
        default: uuid.v4
      },
      email: {
        type: String,
        trim: true,
        required: true
      }
  });
  inviteSchema.plugin(timestamps);
  return mongoose.model('Invite', inviteSchema)
};

module.exports = new InviteModel();