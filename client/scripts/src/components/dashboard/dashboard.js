define(['knockout', 'text!./dashboard.tmpl.html', './models', './data'], function(ko, tmpl, models, svc){

  function ViewModel(app){
    var self = this;
    this.applications = ko.observableArray();
    this.filter = ko.observable();

    self.doFilter = function (filter) {
      self.filter(filter);
      var query = {};
      switch (filter){
        case 'created':
          query.created_by = app.user().id;
          break;
        case 'assigned':
          query.assigned_to = app.user().id;
          break;
        case 'scheduled':
          query.scheduled = app.user().id;
      }
      svc.getApplications(query, function (err, list) {
        if(list){
          var tmp = list.map(function (i) {
            return new models.Application(i);
          });
          self.applications(tmp);
        }
      })
    };

    self.doFilter('assigned');
  }

  return {
    viewModel: {
      createViewModel: function (params, component) {
        return new ViewModel(params);
      }
    },
    template: tmpl
  }
});