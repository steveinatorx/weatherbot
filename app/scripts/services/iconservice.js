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
        case 'clear':
              myIcon='wi wi-day-sunny';
          break;
        case 'nt_partlycloudy':
              myIcon='wi wi-night-cloudy';
          break;
        case 'partlycloudy':
              myIcon='wi wi-day-cloudy';
          break;
        case 'partlycloudy':
              myIcon='wi wi-day-cloudy';
          break;
        case "nt_mostlycloudy":
              myIcon='wi wi-cloud';
          break;
         case "mostlycloudy":
              myIcon='wi wi-cloud';
          break;



      }
      return myIcon;
    };

  });



