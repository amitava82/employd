define(['knockout', 'text!./nav-bar.tmpl.html'], function(ko, tmpl){

  function ViewModel(app){
    this.user = app.user;
  }

  return {
    viewModel: {
      createViewModel: function (params, component) {
        return new ViewModel(params.app);
      }
    },
    template: tmpl
  }
});