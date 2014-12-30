define(['knockout', 'text!./dashboard.tmpl.html'], function(ko, tmpl){

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