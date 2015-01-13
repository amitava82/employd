define(['knockout', 'text!./openings.tmpl.html', './models', './data', 'pagejs'], function(ko, tmpl, models, svc, page){

  function ViewModel(){
    var self = this;
    this.openings = ko.observableArray();
    this.selected = ko.observable();
    this.newOpening = ko.observable();
    this.select = function(model){
      self.selected(model);
    };

    models.Opening.getAll(function(err, list){
      self.openings(list);
    });

  }
  ViewModel.prototype.create = function () {
    svc.create({title: this.newOpening()}, function (err, opening) {
      if(opening){
        page('/app/openings/'+opening._id);
      }
    });
  };

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