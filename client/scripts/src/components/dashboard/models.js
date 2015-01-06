define(['knockout', './data', 'lodash'], function(ko, svc, _){

  function Application(data){
    data = data || {};
    this.id = data._id;
    this.candidate = data.candidate;
    this.opening = data.opening;
    this.createdAt = data.createdAt;
    this.current_stage = _.findWhere(data.opening.stages, {_id: data.current_stage});
  }

  return {
    Application: Application
  }
});