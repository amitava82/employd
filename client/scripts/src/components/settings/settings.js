define(['knockout', 'text!./settings.tmpl.html', './models', './data'], function (ko, tmpl, models, svc) {

  function ViewModel(app){
    var self = this;
    this.tab = app.route().params.tab;
    this.invite = new models.Invite();
    this.users = ko.observableArray();

    this.sendInvite = function () {
      self.invite.send(function (err) {
        console.log(err);
        if(!err){
          self.invite.email('');
          self.invite.role('');
        }
      });
    };

    this.deleteUser = function (user) {
      svc.deleteUser(user._id, function (err) {
        if(err){
          console.log(err);
        }else{
          self.users.remove(user);
        }
      })
    };

    if(self.tab == 'users'){
      svc.getUsers(function (err, list) {
        self.users(list);
      })
    }
  }
  return {
    viewModel: {
      createViewModel: function (params) {
        var vm = new ViewModel(params);
        return vm;
      }
    },
    template: tmpl
  }
})