module.exports = function (app, controller, middleware) {

  var viewController = controller.view,
      authController = controller.auth,
      openingController = controller.opening,
      candidateController = controller.candidate,
      applicationController = controller.application,
      usersController = controller.user;


  app.get("/", viewController.index.bind(viewController));
  app.get("/signin", viewController.loginView);
  app.post("/signin", authController.login.bind(authController));
  app.post("/signup", authController.signup.bind(authController));

  app.get("/confirm/:invite", authController.validateInvite.bind(authController));
  app.post("/confirm/:invite",  authController.setupAccount.bind(authController));


  //opening route
  app.get("/api/openings/?", middleware.apiRequest, openingController.list.bind(openingController));
  app.get("/api/openings/:id", middleware.apiRequest, openingController.show.bind(openingController));
  app.post("/api/openings", middleware.apiRequest, openingController.create.bind(openingController));

  //user
  app.get("/api/users/?", middleware.apiRequest, usersController.list.bind(usersController));


  //candidates
  app.get("/api/candidates/?",middleware.apiRequest, candidateController.list.bind(candidateController));
  app.get("/api/candidates/:id",middleware.apiRequest, candidateController.show.bind(candidateController));
  app.post("/api/candidates/?",middleware.apiRequest, candidateController.create.bind(candidateController));


  //application
  app.get("/api/applications/?", middleware.apiRequest, applicationController.list.bind(applicationController));
  app.get("/api/applications/:id", middleware.apiRequest, applicationController.show.bind(applicationController));
  app.post("/api/applications", middleware.apiRequest, applicationController.create.bind(applicationController));


  app.get("/api/:model/?", middleware.apiRequest, function(req, res){
    res.status(200).send(req.body);
  });
  app.post("/api/:model/?", middleware.apiRequest, function(req, res){
    res.status(200).send(req.body);
  });

  app.get("/app*", middleware.apiRequest,  function(req, res){
    res.render("spa", {
      user: req.session.user
    });
  });

  //app.get("/api/:model/?")
  //app.get("/api/:model/:id?")

};