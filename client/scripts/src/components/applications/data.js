define(['request'], function(request){

  return {
    getApplications: function (params, callback) {
      request.list('applications', params, callback);
    },

    getById: function(id, callback){
      request.show('applications', {id: id}, callback);
    }
  }
});