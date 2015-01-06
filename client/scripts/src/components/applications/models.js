define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Application(data){
    data = data || {};
    var self = this;

    this.id = data._id;
    this.candidate = ko.observable(data.candidate);
    this.opening = ko.observable(data.opening);
    this.assigned_to = ko.observable(data.assigned_to);
    this.current_stage = ko.computed(function(){
     var opening = self.opening();
      if(opening){
       return _.findWhere(opening.stages, {_id: data.current_stage});
      }
    });

    this.notes = ko.observableArray(data.notes);
  }

  Application.prototype.addNote = function (text, cb) {
    var self = this;
    svc.addNote(self.id, text, function (err, app) {
      if(app){
        self.notes(app.notes);
      }
      cb(err);
    })
  };

  Application.prototype.assignUser = function (user) {
    var self = this;
    svc.assignUser(user.user._id, self.id, function (err, app) {
      self.assigned_to(app.assigned_to);
    });
  };

  Application.getAll = function(callback){
    svc.getApplications({}, function(err, list){
      var tmp = _.map(list, function(i){
        return new Application(i);
      });
      callback(err, tmp);
    });
  };

  Application.get = function (id, cb) {
    svc.getById(id, function (err, application) {
      var model = new Application(application);
      cb(err, model);
    })
  };

  return {
    Application: Application
  }
});