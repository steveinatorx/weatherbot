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
      if(typeof input === 'undefined') return '';
      var len=input.length;

      if (len<100){
        //pad
        //console.log('len?'+len)
        return input+Array(103 - input.length).join('x');

      }else {

        return input.slice(0,100);
      }

    };
  });
