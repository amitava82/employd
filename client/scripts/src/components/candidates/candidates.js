define(['knockout', 'text!./candidates.tmpl.html', './models'], function(ko, tmpl, models){

  function ViewModel(){
    var self = this;

    this.candidates = ko.observableArray();
    this.selected = ko.observable();

    models.Candidate.getAll(function(err, list){
      self.candidates(list);
    });

  }

  return {
    viewModel: {
      createViewModel: function (params, component) {
        return new ViewModel();
      }
    },
    template: tmpl
  }
});