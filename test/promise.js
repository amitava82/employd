var Promise = require('mpromise');
var when = require('when');
var promise = new Promise();


var p = promise.then(function () {
  return 2;
}).then(function (r) {
  console.log('first', r)
  return r+3
}).then(function(r){
  var deferred = when.defer();
  setTimeout(function () {
    console.log('timeout')
    deferred.resolve(r+2)
  }, 500);
  console.log(r);
  return deferred.promise;
}).onFulfill(function(r){
  console.log('resolved', r)
}).onReject(function (e) {
  console.log('error', e)
})

promise.fulfill(37)