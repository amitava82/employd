var _ = require("lodash");

module.exports = function(){

  function init(req, res, next){

  }

  function validateSession(req, res, next){
    if(!req.session || (req.session.auth !== true || _.isEmpty(req.session.user))){
      //invalid session
      if(req.xhr){
        res.send(401);
      }else{
        res.redirect("/signin");
      }
    }else{
      next();
    }
  }

  function validatePermission(req, res, next){

  }

  return {
    authRoute: [validateSession],
    apiRequest: [validateSession]
  }
};
