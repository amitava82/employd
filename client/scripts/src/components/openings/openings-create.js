define(['knockout', 'text!./openings-create.tmpl.html', 'request', 'pagejs', './models'],
  function(ko, tmpl, request, page, models){

  function ViewModel(){
    var self = this;
    this.opening = new models.Opening();
    this.users = ko.observableArray();

    request.list('users', {}, function(err, users){
      self.users(users);
    })
  }

  ViewModel.prototype.save = function(){
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
        return new ViewModel();
      }
    },
    template: tmpl
  }
});