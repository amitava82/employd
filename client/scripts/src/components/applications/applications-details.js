define(['knockout', './models', 'text!./applications-details.tmpl.html', './data'], function(ko, models, tmpl, svc){

  function ViewModel(app){
    var self = this;
    this.application = ko.observable();
    this.users = ko.observableArray();
    this.newNote = ko.observable();

    models.Application.get(app.route().params.id, function (err, application) {
      self.application(application);
    });
  }

  ViewModel.prototype.addNote = function () {
    var self = this;

    self.application().addNote(self.newNote(), function (err) {
      if(err){
        alert(err.message);
      }else{
        self.newNote('');
      }
    })
  };

  ViewModel.prototype.getUsers = function () {
    var self = this;
    svc.getUsers(function(err, users){
      self.users(users);
    });
  };


  return {
    viewModel: {
      createViewModel: function (params) {
        var vm = new ViewModel(params);
        return vm;
      }
    },
    template: tmpl
  }
});