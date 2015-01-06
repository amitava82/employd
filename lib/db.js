"use strict";

var mongoose = require('mongoose');

mongoose.set('debug', true);

var db = function(){
  return {
    init: function(config){
      mongoose.connect(config);

      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function (callback) {
        console.log("db conn open");
      });
      process.on('SIGINT', function() {
        mongoose.connection.close(function () {
          console.log('Mongoose disconnected through app termination');
          process.exit(0);
        });
      });
    }
  }
};

module.exports = db();