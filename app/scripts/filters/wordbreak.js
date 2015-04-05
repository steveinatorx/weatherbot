'use strict';

/**
 * @ngdoc filter
 * @name weatherbotApp.filter:wordBreak
 * @function
 * @description
 * # wordBreak
 * Filter in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .filter('wordBreak', function () {
    return function (input) {

      var treated =  input.split(/\s+/).length<2 ? input+"<br>":input;
      return treated;
    };
  });
