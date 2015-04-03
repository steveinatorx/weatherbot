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

      var myIcon='';
      switch (raw) {

        case 'nt_clear':
          myIcon = 'wi wi-night-clear';
          break;
      }
      return myIcon;
    };

  });



