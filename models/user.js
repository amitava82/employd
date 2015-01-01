"use strict";
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjId = mongoose.Schema.Types.ObjectId;

var UserModel = function(){

  //var mappingSchema = mongoose.Schema({
  //  orgId: {
  //    type: ObjId,
  //    ref: 'Organization',
  //    required: true
  //  },
  //  role: {
  //    type: Number,
  //    //ref: 'Role',
  //    required: true
  //  }
  //});

  var userSchema = mongoose.Schema({
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    telephone: {
      type: String,
      trim: true
    },
    salt: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    org: {
      type: {
        type: ObjId,
        ref: 'Organization'
      }
    },
    timezone: String
  });

  userSchema.virtual('name').get(function(){
    return this.firstname + ' ' + this.lastname;
  });

  userSchema.virtual('name').set(function(name){
    var arr =name.split(' ');
    this.firstname = arr[0];
    this.lastname = name.replace(this.firstname, "").trim();
  });

  userSchema.plugin(timestamps);

  return mongoose.model("User", userSchema)
};

module.exports = new UserModel();