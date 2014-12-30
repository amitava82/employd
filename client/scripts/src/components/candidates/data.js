define(['request'], function(request){
  return {
    getCandidates: function (callback) {
      request.list('candidates', {}, callback);
    },
    save: function (model, callback) {
      request.create('candidates', model, callback);
    }
  }
});