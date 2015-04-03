'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.weatherApi
 * @description
 * # weatherApi
 * Service in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .service('weatherApi', function ($http, $log, $q, ENV) {

        var self = this;

          $log.info('http://api.wunderground.com/api/' + ENV.wundergroundApiKey +'/hourly/q/CA/San_Francisco.json?callback=JSON_CALLBACK');
        $log.log('key',ENV.wundergroundApiKey);

        self.getCurrentWeather = function() {
            var data= self.makeApiCall('http://api.wunderground.com/api/' + ENV.wundergroundApiKey +'/conditions/q/CA/San_Francisco.json?callback=JSON_CALLBACK');
            return data;
        };

        self.getHourlyWeather = function() {
            var data=self.makeApiCall('http://api.wunderground.com/api/' + ENV.wundergroundApiKey +'/hourly/q/CA/San_Francisco.json?callback=JSON_CALLBACK');
            console.log('hey',data);
            return data;
        };

        //we want to post-process this request because wunderground can pass an error stanza back so wrap into a promise
        self.makeApiCall = function(endpoint) {
          var deferred = $q.defer();

          $http.jsonp(endpoint)
          .success(function(data) {
            $log.log(data);
            if(data.error) {
              deferred.reject(data.error);
            }
            deferred.resolve(data);
          }).error(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
        };







});
