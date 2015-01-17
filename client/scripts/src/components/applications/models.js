define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Application(data){
    data = data || {};
    var self = this;

    this.id = data._id;
    this.candidate = ko.observable(data.candidate);
    this.opening = ko.observable(data.opening);
    this.assigned_to = ko.observable(data.assigned_to);
    this.current_stage = ko.observable(data.current_stage);
    this.stages = ko.observableArray(data.stages);
    this.stage = ko.computed(function(){
     var opening = self.opening();
     var stage = self.current_stage();
      if(opening){
       return _.findWhere(opening.stages, {_id: stage});
      }
    });
    var lastStage = this.stages.pop();
    this.notes = ko.observableArray(data.notes);

    if(!lastStage){
      this.feedback = new Feedback({stage_id: this.current_stage});
    }else{
      this.feedback = new Feedback(lastStage);
    }

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

  Application.prototype.changeStage = function (stage) {
    var self = this;
    svc.changeStage(self.id, stage._id, function (err, app) {
      self.current_stage(app.current_stage);
      self.assigned_to(app.assigned_to);
    })
  };

  Application.prototype.saveFeedback = function (callback) {
    var self = this;
    var feedback = ko.toJS(self.feedback);
    svc.addFeedback(self.id, feedback, callback);
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


  function Feedback(data){
    data = data || {};
    this.stage_id = data.stage_id;
    this.feedback = ko.observable(data.feedback);
    this.user = ko.observable(data.user);
    this.status = ko.observable(data.status);
    this.completed = data.completed;
    this.schedules = data.schedules;
  }

  return {
    Application: Application,
    Feedback: Feedback
  }
});