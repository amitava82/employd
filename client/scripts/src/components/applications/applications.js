define(['knockout', './models', 'text!./applications.tmpl.html'], function(ko, models, tmpl){

  function ViewModel(){
    var self = this;
    this.applications = ko.observableArray();

    models.Application.getAll(function(err, list){
      self.applications(list);
    });

  }

  return {
    viewModel: {
      createViewModel: function (params) {
        var vm = new ViewModel();
        return vm;
      }
    },
    template: tmpl
  }
});