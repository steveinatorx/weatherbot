'use strict';

/**
 * @ngdoc overview
 * @name weatherbotApp
 * @description
 * # weatherbotApp
 *
 * Main module of the application.
 */
angular
  .module('weatherbotApp', [
    'ngMockE2E',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'config',
    'geolocation',
    'LocalStorageModule',
    'ngLodash'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  }).run(function ($httpBackend) {

    $httpBackend.whenGET(/^.*/).passThrough();
    $httpBackend.whenJSONP(/^.*/).passThrough();
    /*
    if(ENV.mockApi === true) {
        console.log('injected interceptor!!!!!!!')
        $httpProvider.interceptors.push('httpInterceptor')

    }*/

  });
