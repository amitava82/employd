define(['knockout', './models', 'text!./applications-details.tmpl.html'], function(ko, models, tmpl){

  function ViewModel(app){
    var self = this;
    this.application = ko.observable();
    models.Application.get(app.route().params.id, function (err, application) {
      self.application(application);
    });
  }


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