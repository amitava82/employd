define(['request'], function(request){

  return {
    getApplications: function (params, callback) {
      request.list('applications', params, callback);
    },

    getById: function(id, callback){
      request.show('applications', {id: id}, callback);
    },

    addFeedback: function (appId, data, cb) {
      request.create(['applications', appId, 'feedbacks'], data, cb);
    }
  }
});