define(['knockout', 'text!./nav-bar.tmpl.html'], function(ko, tmpl){

  function ViewModel(app){
    var self = this;
    this.user = app.user;
    this.menus = [
      new Menu('Dashboard', '/app/dashboard'),
      new Menu('Applications', '/app/applications'),
      new Menu('Openings', '/app/openings'),
      new Menu('Candidates', '/app/candidates'),
      new Menu('Settings', '/app/settings')
    ];

    function Menu(name, url) {
      this.name = name;
      this.url = url;
      this.active = ko.computed(function () {
        var path = app.route().pathname;
        return path.indexOf(url) === 0;
      });
    }
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