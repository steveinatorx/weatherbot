'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.dispatchService
 * @description
 * # dispatchService
 *  socket management layer
 */
angular.module('weatherbotApp')
  .service('dispatchService', function ($log, mySocket) {
        /**
         *  query server and get available topic keys for client uuid and data.geo.lat data.geo.long
         *  todo: pin topic subscriptions to server auth/identity token
         */
        this.initTopics=function(initData){
          //set up response dispatcher

          mySocket.on(initData.clientId+'TopicList',function(data){
            $log.warn('###TOPICS received',data);
          });

          $log.warn('###getTopics called',initData);
          mySocket.emit('getTopics',initData);

        };
        //listeners
  });
