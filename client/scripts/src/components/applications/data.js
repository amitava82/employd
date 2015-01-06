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
    },

    addNote: function(appId, text, cb ){
      request.create(['applications', appId, 'notes'], {note: text}, cb);
    },

    getUsers: function(cb){
      request.list('users', {}, cb);
    },

    assignUser: function (userId, appId, cb) {
      request.update('applications', {id: appId, assigned_to: userId}, cb);
    }
  }
});