define(['knockout', 'text!./candidates-create.tmpl.html', 'request', 'pagejs', './models'],
  function(ko, tmpl, request, page, models){

    function ViewModel(){
      var self = this;
      this.candidate = new models.Candidate();

      this.save = function(candidate, e){
        candidate.save(function(err){
          console.log(err);
        })
      }
    }

    return {
      viewModel: {
        createViewModel: function (params, component) {
          var vm = new ViewModel();
          return vm;
        }
      },
      template: tmpl
    }
});