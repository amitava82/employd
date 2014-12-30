define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Application(data){
    data = data || {};
    var self = this;

    this.id = data._id;
    this.candidate = ko.observable(data.candidate);
    this.opening = ko.observable(data.opening);
  }

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