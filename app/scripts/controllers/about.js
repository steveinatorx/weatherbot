'use strict';

/**
 * @ngdoc function
 * @name weatherbotApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
