/*global require, window */

// Author: Loïc Knuchel <loicknuchel@gmail.com>

// Require.js allows us to configure shortcut alias
require.config({
  baseUrl: "/scripts/src",
  paths: {
    knockout: "//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min",
    jquery: "//cdn.jsdelivr.net/jquery/2.1.1/jquery.min",
    lodash: "//cdn.jsdelivr.net/lodash/2.4.1/lodash.min",
    text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
    moment: "//cdn.jsdelivr.net/momentjs/2.8.4/moment.min",
    pagejs: "../lib/page",
    router: "./router",
    funnel: "./funnel",
    registry: "./registry",
    request: "./request",
    'ko.custom': "./ko.custom",
    bootstrap: "//cdn.jsdelivr.net/bootstrap/3.3.1/js/bootstrap.min",
    'jquery.form': "//cdnjs.cloudflare.com/ajax/libs/jquery.form/3.51/jquery.form.min",
    storage: "../lib/simpleStorage",
    sortable: "../lib/jquery.sortable"
  },
  shim: {
    bootstrap: {deps: ['jquery']},
    sortable: {deps: ['jquery']}
  }
});

define(['knockout', 'funnel', 'router', 'registry', 'jquery', 'bootstrap', 'ko.custom'], function(ko, App, router, components, $){

  var app = new App(router);
  app.init(window.user);
  delete window.user;

  $.ajaxSetup({
    statusCode : {
      401 : function (xhr) {
        console.log(xhr)
        window.location = "/signin";
      }
    },
    beforeSend: function () {
      app.loading.push(true);
    },
    complete: function () {
      app.loading.pop();
    }
  });

  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });
  
  setTimeout(function(){
    ko.applyBindings(app);
  }, 100);

});

