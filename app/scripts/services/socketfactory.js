'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.socketFactory
 * @description
 * # socketFactory
 * Factory in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .factory('mySocket', function (socketFactory) {

    //var ioSocket = io('http://localhost:8000');
    //var myIoSocket = io.connect('http://localhost:3000', {transports:['websocket']});
    var myIoSocket = window.io.connect('http://10.10.10.100:8080', {transports:['websocket']});

    var mySocket = socketFactory({ioSocket: myIoSocket});

    return mySocket;

 });
