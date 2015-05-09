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

    this.getIcon = function (raw) {

      console.log('####in iconService',raw);

      var myIcon='';
      switch (raw) {

        case 'nt_clear':
          myIcon = 'wiNight wi wi-night-clear';
          break;
        case 'clear':
              myIcon='wiDay wi wi-day-sunny';
          break;
        case 'nt_partlycloudy':
              myIcon='wiNight wi wi-night-cloudy';
          break;
        case 'partlycloudy':
              myIcon='wiDay wi wi-day-cloudy';
          break;
        case 'nt_mostlycloudy':
              myIcon='wiNight wi wi-cloud';
          break;
        case 'mostlycloudy':
              myIcon='wiGray wi wi-cloud';
          break;



      }
      return myIcon;
    };

  });



