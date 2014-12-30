define(['knockout', 'text!./nav-bar.tmpl.html'], function(ko, tmpl){

  function ViewModel(){

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