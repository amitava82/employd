"use strict";

module.exports = function(models){
  return {

    index: function(req, res){
      res.render("index");
    },

    loginView: function(req, res){
      res.render("signin")
    },

    registration: function(req, res){
      res.render("")
    }

  }
};