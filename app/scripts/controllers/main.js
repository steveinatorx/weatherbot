'use strict';

/**
 * @ngdoc function
 * @name weatherbotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('MainCtrl', function ($scope, $log, geolocation, localStorageService, ENV, weatherApi) {

  $scope.$watch('geo',function() {
    $log.log('geo ticked');
    /*weatherApi.getWeather()
    .then(function(data) {
      $log.info(data);
    });*/
  }, true);

  $scope.alerts=[];

  function init() {
    if (typeof ENV.wundergroundApiKey === 'undefined') {
        addAlert({'msg':'Error! missing the WUNDERGROUNDAPIKEY environment variable. get one here <a href="http://www.wunderground.com/weather/api/"> wunderground api </a> and set this in your environment to run the weather API calls','type':'danger'});

    }
    if(!assertGeoAuth()) {
      getGeo();
    }
  }
  init();

  function addAlert(alert) {
    $scope.alerts.push(alert);
  }

  $scope.getGeo = function() {
     getGeo();
  };

  $scope.closeAlert = function(index) { 
    $scope.alerts.splice(index, 1);
  };

  function getGeo() {
    console.log('getGeo');
   geolocation.getLocation().then(function(data){
     $scope.geo = {lat:data.coords.latitude, long:data.coords.longitude};
     localStorageService.set('geo',$scope.geo);
     localStorageService.set('authorizedGeo',true);
   });
  }

  function assertGeoAuth() {
    if(typeof localStorageService.get('authorizedGeo') === 'undefined' || localStorageService.get('authorizedGeo') === '0' ||  localStorageService.get('authorizedGeo') === null ) { return false;
    } else {
       $scope.geo=localStorageService.get('geo'); 
       return true;
     }
  }

});
