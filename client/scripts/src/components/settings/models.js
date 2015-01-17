define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Invite(){
    var self = this;
    this.email = ko.observable();
    this.role = ko.observable();

    this.send = function (callback) {
      svc.sendInvite(ko.toJSON(self), callback);
    }
  }
  return {
    Invite: Invite
  }

});