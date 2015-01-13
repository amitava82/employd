define(['knockout', 'text!./openings-details.tmpl.html', 'request', 'pagejs', './models'],
  function(ko, tmpl, request, page, models){

  function ViewModel(app){
    var self = this;
    var params = app.route().params;
    this.opening = ko.observable(new models.Opening());
    this.users = ko.observableArray();

    request.list('users', {}, function(err, users){
      self.users(users);
    });

    models.Opening.get(params.id, function (err, opening) {
      if(opening){
        self.opening(opening);
      }
    })
  }

  ViewModel.prototype.save = function(){
    console.log(ko.toJSON(this));
    return
    request.create('openings', ko.toJSON(this), function(err, resp){
      if(err){
        console.log(err);
      }else{
        page.redirect('/openings')
      }
    });
  };

  return {
    viewModel: {
      createViewModel: function (params, component) {
        return new ViewModel(params);
      }
    },
    template: tmpl
  }
});