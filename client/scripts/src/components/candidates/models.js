define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Candidate(data){
    data = data || {};

    var self = this;
    this.id = data._id;
    this.firstname = ko.observable(data.firstname);
    this.lastname = ko.observable(data.lastname);
    this.email = ko.observable(data.email);
    this.telephone = ko.observable(data.telephone);
    this.source = ko.observable(data.source);
    this.resume = ko.observable(data.resume);
    this.resumeText = ko.observable(data.resumeText);
    this.applications = ko.observableArray(data.applications);

  }

  Candidate.prototype.toJSON = function(){
    var copy = ko.toJS(this);
    return _.pick(copy, ['firstname', 'lastname', 'email', 'telephone', 'source', 'resume', 'resumeText'])
  };

  Candidate.getAll = function(callback){
    svc.getCandidates(function (err, list) {
      var tmp = [];
      list = list || [];
      tmp = list.map(function(i){
        return new Candidate(i);
      });
      callback(err, tmp);
    });
  };

  return {
    Candidate: Candidate
  }

});