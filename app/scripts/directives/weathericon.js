'use strict';

/**
 * @ngdoc directive
 * @name weatherbotApp.directive:weatherIcon
 * @description
 * # weatherIcon
 */
angular.module('weatherbotApp')
  .directive('weatherIcon', function (iconService) {
    return {
      transclude: true,
      replace: true,
      scope: true,
      template: '<i class="{{wiIconClass}}"></i>',
      restrict: 'E',
      link: function($scope, $elm, attrs){
        //console.log(attrs.condition);
        $scope.wiIconClass=attrs.classList+' '+iconService.getIcon(attrs.condition);
      }
    };
  });
