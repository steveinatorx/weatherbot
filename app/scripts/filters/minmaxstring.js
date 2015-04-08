'use strict';

/**
 * @ngdoc filter
 * @name weatherbotApp.filter:minMaxString
 * @function
 * @description
 * # minMaxString
 * Filter in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .filter('minMaxString', function () {
    return function (input) {
      if(typeof input === 'undefined') {
        return '';}
      var len=input.length;

      if (len<100){
        //pad
        var padArr = new Array(103 - input.length).join(' ');
        return input+padArr;

      }else {

        return input.slice(0,100);
      }

    };
  });
