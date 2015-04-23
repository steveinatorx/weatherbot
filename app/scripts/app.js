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
    'ngLodash',
    'btford.socket-io',
    'uuid',
    'uiGmapgoogle-maps'
  ])
  .config(function ($routeProvider,uiGmapGoogleMapApiProvider ) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBL9J7aT7oeMrQHT_SdGgDL7AG9_KNfqj8',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
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
