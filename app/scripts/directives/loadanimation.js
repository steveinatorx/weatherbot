'use strict';

/**
 * @ngdoc directive
 * @name weatherbotApp.directive:loadAnimation
 * @description
 * # loadAnimation
 */
angular.module('weatherbotApp')
  .directive('loadAnimation', function () {
    return {
      template: '<div id="fadingBarsG"><div id="fadingBarsG_1" class="fadingBarsG"> </div> <div id="fadingBarsG_2" class="fadingBarsG"> </div> <div id="fadingBarsG_3" class="fadingBarsG"> </div> <div id="fadingBarsG_4" class="fadingBarsG"> </div> <div id="fadingBarsG_5" class="fadingBarsG"> </div> <div id="fadingBarsG_6" class="fadingBarsG"> </div> <div id="fadingBarsG_7" class="fadingBarsG"> </div> <div id="fadingBarsG_8" class="fadingBarsG"> </div></div>',
      restrict: 'E',
      link: function postLink() {

        console.log('in loadanim');
      }
    };
  });
