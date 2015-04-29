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

           $log.warn('recd curWeather:',data);

            currentWeather=JSON.parse(data);
            $rootScope.$broadcast('tickCurrentWeather');

          });

          mySocket.on(initData.clientId+'TopicList',function(data){
            $log.warn('###TOPICS received',data);
          });

          $log.warn('###getTopics called',initData);
          mySocket.emit('getTopics',initData);

        };
        //listeners
  });
