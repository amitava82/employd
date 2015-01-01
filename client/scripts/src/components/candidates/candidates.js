define(['knockout', 'text!./candidates.tmpl.html', './models', './data'], function(ko, tmpl, models, data){

  function ViewModel(){
    var self = this;

    this.candidates = ko.observableArray();
    this.selected = ko.observable();
    this.openings = ko.observableArray();
    this.opening = ko.observable();

    this.startAssign = function(model){
      self.selected(model);

      if(self.openings().length == 0){
        data.getOpenings(function(err, list){
          self.openings(list);
        })
      }
    };

    this.cancelAssign = function () {
      self.selected(null);
    };

    this.saveAssign = function () {
      data.createApplication(self.selected()._id, self.opening(), function (err, app) {
        console.log(err, app);
      })
    };

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