define(['knockout', 'text!./openings.tmpl.html', './models'], function(ko, tmpl, models){

  function ViewModel(){
    var self = this;
    this.openings = ko.observableArray();
    this.selected = ko.observable();

    this.select = function(model){
      self.selected(model);
    };

    models.Opening.getAll(function(err, list){
      self.openings(list);
    });

  }

  ViewModel.prototype.get = function(){};

  return {
    viewModel: {
      createViewModel: function (params, component) {
        return new ViewModel();
      }
    },
    template: tmpl
  }
});