define(['knockout', 'text!./candidates-create.tmpl.html', 'request', 'pagejs', './models', 'jquery.form', 'jquery'],
  function(ko, tmpl, request, page, models){

    function ViewModel(){
      var self = this;
      this.candidate = new models.Candidate();

      this.save = function(candidate, e){
        candidate.save(function(err){
          console.log(err);
        })
      }

      this.onSubmit = function (err, data) {
        console.log(err, data);
        if(data){
          page('/app/candidates');
        }
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