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
    'nvd3',
    'uiGmapgoogle-maps',
    'ds.clock',
    'ngMaterial',
    'angularMoment'

  ])
  .config(function ($routeProvider, $locationProvider, uiGmapGoogleMapApiProvider ) {

    //$locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/beta', {
        templateUrl: 'views/beta.html',
        controller: 'BetaCtrl'
      }).otherwise({ redirectTo: '/'});

    //todo: move to env var/config
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBL9J7aT7oeMrQHT_SdGgDL7AG9_KNfqj8',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });





  }).run(function ($httpBackend, $rootScope) {
    $rootScope._ = window._;

    $httpBackend.whenGET(/^.*/).passThrough();
    $httpBackend.whenJSONP(/^.*/).passThrough();
    /*
    if(ENV.mockApi === true) {
        console.log('injected interceptor!!!!!!!')
        $httpProvider.interceptors.push('httpInterceptor')

    }*/

  });
