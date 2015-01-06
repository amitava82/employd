module.exports = function(models){
  return {
    auth: require("./auth")(models),
    view: require("./view")(models),
    opening: require("./opening")(models),
    candidate: require("./candidate")(models),
    user: require("./users")(models),
    application: require('./application')(models),
    settings: require('./settings')(models)
  };
};