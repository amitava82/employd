define(['request'], function(request){

  return {
    getOpenings: function(callback){
      request.list('openings', {}, callback);
    }
  }
});
