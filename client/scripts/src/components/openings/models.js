define(['knockout', './data', 'lodash'], function(ko, svc, _){

  var models = {};



  models.Opening = function(data){
    data = data || {};
    var self = this;
    this.id = data._id;
    this.title = ko.observable(data.title);
    this.description = ko.observable(data.description);
    this.stages = ko.observableArray([]);
    this.created_by = ko.observable(data.created_by);

    _.forEach(data.stages, function (i) {
      self.stages.push(new models.Stage(i))
    });
  };

  models.Opening.prototype = {
    addStage: function () {
      this.stages.push(new models.Stage());
    },

    removeStage: function(stage){
      this.stages.remove(stage);
    },

    save: function (cb) {
      var self = this;
      var data = ko.toJSON(self);
      data = JSON.parse(data);
      delete data.created_by;
      svc.save(data, cb);
    }
  };

  models.Opening.getAll = function(cb){
    svc.getOpenings(function(err, openings){
      if(openings){
        var list = [];
        openings.forEach(function(i){
          list.push(new models.Opening(i));
        });
        cb(err, list);
      }

    });
  };

  models.Opening.get = function (id, cb) {
    svc.get(id, function (err, opening) {
      if(opening){
        var m = new models.Opening(opening);
        cb(null, m);
      }else{
        cb(err);
      }
    })
  };

  models.Stage = function(data){
    data = data || {};
    var self = this;
    this._id = data._id;
    this.name = ko.observable(data.name);
    this.user = ko.observable(data.user);
    this.category = ko.observable(data.category);
    this.isDefault = data.isDefault;
    this.final = ko.observable(!!data.final);
  };

  return models;

});