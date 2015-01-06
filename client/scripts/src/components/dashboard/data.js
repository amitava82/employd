define(['request'], function(request){
  return {
    getApplications: function (filter, cb) {
      request.list('applications', filter, cb);
    }
  }
});