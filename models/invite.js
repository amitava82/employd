"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uuid = require('uuid');
var ObjId = mongoose.Schema.Types.ObjectId;

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
        required: true,
        unique: true
      },
      org: {type: ObjId, ref: 'Organization'},
      from: {type: ObjId, ref: 'User'},
      role: String
  });
  inviteSchema.plugin(timestamps);
  return mongoose.model('Invite', inviteSchema)
};

module.exports = new InviteModel();