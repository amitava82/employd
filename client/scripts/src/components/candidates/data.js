define(['request'], function(request){
  return {
    getCandidates: function (callback) {
      request.list('candidates', {}, callback);
    },
    save: function (model, callback) {
      request.create('candidates', model, callback);
    },

    getOpenings: function (callback) {
      request.list('openings', {}, callback);
    },

    createApplication: function (candidate, opening, cb) {
      request.create('applications', {candidate: candidate, opening: opening}, cb);
    }
  }
});