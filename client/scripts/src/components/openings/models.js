define(['knockout', './data', 'lodash'], function(ko, svc, _){

  var models = {};



  models.Opening = function(data){
    data = data || {};
    var self = this;

    this.title = ko.observable(data.title);
    this.description = ko.observable(data.description);
    this.stages = ko.observableArray(data.stages || defaultStages);
  };

  models.Opening.prototype = {
    addStage: function () {
      this.stages.push(new models.Stage());
    },
    removeStage: function(stage){
      this.stages.remove(stage);
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

  models.Stage = function(data){
    data = data || {};
    var self = this;
    this.name = ko.observable(data.name);
    this.users = ko.observableArray(data.users || []);
    this.feedbacks = ko.observableArray();
  };

  var defaultStages = [
    new models.Stage({name: 'Screening'}),
    new models.Stage({name: 'Technical 1'}),
    new models.Stage({name: 'Technical 2'}),
    new models.Stage({name: 'Technical 3'}),
    new models.Stage({name: 'HR'})
  ];

  return models;

});