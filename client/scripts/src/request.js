define(['jquery'], function ($) {
  var baseUrl = "/api/";

  function parseError(xhr){
    var resp = xhr.responseText || "";
    var error = {};
    error.status = xhr.status;
    try{
      var j  = JSON.parse(resp);
      if(j){
        error.message = j.error || xhr.responseText || xhr.statusText;
      }
    }catch(e){
      error.message = xhr.statusText;
    }
    return error;
  }

  function makeUrl(model, data){
    var url = baseUrl;

    if(model instanceof Array){
      url += '/' + model.join('/');
    }else{
      url += model;
      if(data.id){
        url += '/' + data.id;
      }
    }
    delete data.id;
    return url;
  }

  function makeRequest(model, method, data, callback){
    if(typeof data === 'string'){
      data = JSON.parse(data);
    }
    var url = makeUrl(model, data);

    $.ajax({
      url: url,
      cache: false,
      data: data,
      type: method
    }).done(function(resp){
      callback(null, resp);
    }).fail(function(xhr){
      callback(parseError(xhr));
    });
  }
  return {
    create: function(model, data, callback){
      makeRequest(model, 'POST', data, callback);
    },

    update: function(model, data, callback){
      makeRequest(model, 'PUT', data, callback);
    },

    list: function (model, data, callback) {
      makeRequest(model, 'GET', data, callback);
    },

    show: function (model, data, callback) {
      makeRequest(model, 'GET', data, callback);
    },

    remove: function (model, data, callback) {
      makeRequest(model, 'DELETE', data, callback);
    }
  }
});