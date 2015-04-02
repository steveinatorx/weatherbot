'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.iconService
 * @description
 * # iconService
 * Service in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .service('iconService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getIcon = function (raw) {

      switch (raw) {

        case "Clear":
          return "wi wi-day-sunny";
          break;
      }
    }

  });



