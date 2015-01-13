/*
 * Router
 */
define(['knockout', 'pagejs'], function(ko, page){

  function Router(){
    var currentRoute = this.currentRoute = ko.observable(null);
    var routes = [{
      url: '/',
      params: {page: 'dashboard'}
    },{
      url: '/dashboard',
      params: {page: 'dashboard'}
    },{
      url: '/setup',
      params: {page: 'setup'}
    }, {
      url: '/openings',
      params: {page: 'openings'}
    }, {
      url: '/openings/new',
      params: {page: 'openings-create'}
    }, {
      url: '/openings/:id',
      params: {page: 'openings-details'}
    }, {
      url: '/candidates',
      params: {page: 'candidates'}
    }, {
      url: '/candidates/new',
      params: {page: 'candidates-create'}
    }, {
      url: '/candidates/:id',
      params: {page: 'candidates-edit'}
    }, {
      url: '/setup',
      params: {page: 'setup'}
    }, {
      url: '/applications',
      params:{page: 'applications'}
    }, {
      url: '/applications/:id',
      params:{page: 'applications-details'}
    }, {
      url: '/settings',
      params: {page: 'settings'}
    }
    ];

    page.base('/app');

    routes.forEach(function(route){
      page(route.url, function(ctx){
        console.log(ctx);
        currentRoute(ko.utils.extend(ctx, route.params));
      });
    });
    page("*", function(){
      console.log("not found")
    });

    page({
      hashbang:false
    });

  }

  return new Router();

});