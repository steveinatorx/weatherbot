'use strict';

/**
 * @ngdoc function
 * @name weatherbotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('MainCtrl', function ($scope, $log, ENV) {


  $scope.alerts=[];

  $scope.addAlert = function(alert) {
    $log.log(alert);
    $scope.alerts.push(alert);
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

    if (typeof ENV.wundergroundApiKey == "undefined") {

        $scope.addAlert({'msg':'Error! missing the WUNDERGROUNDAPIKEY environment variable. get one here and set it in your env <a href="http://www.wunderground.com/weather/api/"> wunderground api </a>','type':'danger'});
    }

});
