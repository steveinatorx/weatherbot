'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.dispatchService
 * @description
 * # dispatchService
 *  socket management layer
 */
angular.module('weatherbotApp')
  .service('dispatchService', function ($log, $rootScope, mySocket, lodash) {
        /**
         *  query server and get available topic keys for client uuid and data.geo.lat data.geo.long
         *  todo: pin topic subscriptions to server auth/identity token
         */

        //todo: throw these into a data service
        var self=this;
        var currentWeather=null;
        var hourlyWeather=null;
        var poi=[];

        this.getPoi=function() {
          return poi;
        };
        this.clearPoi=function(){
          poi=[];
        };

        /* poiData format: {name:xxx,lon:yyy,lat:zzz,data:[ foo:bar, baz:biz]}
         *
         */

        this.addPoi=function(poiData){

            poi.push(poiData);

        };

        this.getCurrentWeather=function() {
          return  currentWeather;
        };

        this.getHourlyWeather=function() {
            return hourlyWeather;
        };

        this.initTopics=function(initData){
          //set up response dispatcher

          mySocket.on('poi',function(data){
            //$log.warn('socket "poi" recd:',data);

            lodash.each(data,function(poiJson){
              if(poiJson !== null) {
                var poi = JSON.parse(poiJson);
                //$log.debug(poi);
                self.addPoi(poi);
              }
            });

            $rootScope.$broadcast('setPoi');

          });

          mySocket.on('currentWeather',function(data){

            currentWeather=JSON.parse(data);

            $log.warn('recd curWeather:',data);

            $rootScope.$broadcast('tickCurrentWeather');

          });

           mySocket.on('hourlyWeather',function(data){

            hourlyWeather=JSON.parse(data);

            $log.warn('recd hourlyWeather:',typeof hourlyWeather);

            $rootScope.$broadcast('tickHourlyWeather');

          });




          mySocket.on('sportsTicker',function(data){
            $log.warn('recd sportsTicker',data);
            $rootScope.sportsTicker=data;
          });

          mySocket.on(initData.clientId+'TopicList',function(data){
            $log.warn('###TOPICS received',data);
          });

          $log.warn('###getTopics called',initData);
          mySocket.emit('getTopics',initData);

        };
        //listeners
  });
