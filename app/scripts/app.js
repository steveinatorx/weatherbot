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
  .config(function ($routeProvider, $httpProvider, ENV) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    //conditional inject
    if(ENV.mockApi === true) {
        console.log('injected interceptor!!!!!!!')
        $httpProvider.interceptors.push('httpInterceptor')

    }

  });

