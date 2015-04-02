'use strict';

/**
 * @ngdoc directive
 * @name weatherbotApp.directive:hourlyWeather
 * @description
 * # hourlyWeather
 *'{{data.length}}<div ng-repeat="hour in data track by $index">{{hour.condition}}</div>',
 */
angular.module('weatherbotApp')
  .directive('hourlyWeather', function () {
    return {
      templateUrl: 'views/hourlyWeather.html',
      transclude: true,
      restrict: 'E',
      scope: {
        data: '='
      } ,
      link: {},

    };
  });
