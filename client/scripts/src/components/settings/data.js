define(['request'], function (request) {
  return {
    sendInvite: function (data, callback) {
      request.create(['org', 'users', 'invite'], data, callback);
    },

    getUsers: function(cb){
      request.list('users', cb);
    },

    deleteUser: function(id, cb){
      request.remove(['org', 'users'], {id: id}, cb);
    }
  }
});