define(["knockout", "jquery"], function(ko, $){
  function App(router){
    //this.router = router;
    this.route = router.currentRoute;
    this.user = ko.observable();
  }

  App.prototype.init = function(user){
    var self = this;
    self.user(user);
  };
  return App;
});