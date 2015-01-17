define(['request'], function(request){

  return {
    getOpenings: function(callback){
      request.list('openings', {}, callback);
    },
    create: function(data, cb){
      request.create('openings', data, cb);
    },

    save: function (data, cb) {
      request.update('openings', data, cb);
    },

    get: function(id, callback){
      request.show('openings', {id: id}, callback);
    }
  }
});
