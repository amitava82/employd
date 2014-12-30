define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Candidate(data){
    data = data || {};

    var self = this;

    this.firstname = ko.observable(data.firstname);
    this.lastname = ko.observable(data.lastname);
    this.email = ko.observable(data.email);
    this.telephone = ko.observable(data.telephone);
    this.source = ko.observable(data.source);
    this.resume = ko.observable(data.resume);
    this.resumeText = ko.observable(data.resumeText);

  }

  Candidate.prototype.save = function(callback){
    var data = this.toJSON();
    svc.save(data, callback)
  };

  Candidate.prototype.toJSON = function(){
    var copy = ko.toJS(this);
    return _.pick(copy, ['firstname', 'lastname', 'email', 'telephone', 'source', 'resume', 'resumeText'])
  };

  Candidate.getAll = function(callback){
    svc.getCandidates(callback);
  };

  return {
    Candidate: Candidate
  }

});