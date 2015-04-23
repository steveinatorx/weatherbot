'use strict';

/*jshint camelcase: false */

/**
 * @ngdoc function
 * @name weatherbotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('MainCtrl', function ($scope, $log, $interval, $q, $http, geolocation, localStorageService, ENV, lodash, weatherApi, feedService, mySocket, dispatchService, rfc4122, uiGmapGoogleMapApi, uiGmapIsReady) {

  $scope.sentGetTopics=false;
  $scope.data={};
  $scope.mapReady=false;

  function getFeed(url){
    var deferred=$q.defer();
    feedService.getFeeds(url,15)
      .then(function (feedsObj) {
        var feed=lodash.map(feedsObj,function(feedObj){
          //console.log('in map',feedObj.title.toString());
          return {title:feedObj.title.toString()};
        });
        return deferred.resolve(feed);
    },function (error) {
      console.error('Error loading feed ', error);
      $scope.error = error;

        return deferred.reject(error);
    });
    return deferred.promise;
  }

    getFeed('http://www.sfgate.com/bayarea/feed/Bay-Area-News-487.php').then(function(feed){
     $scope.localSports=feed;
     $scope.sportsTick=!$scope.sportsTick;
    });

    getFeed('http://www.sfgate.com/bayarea/feed/Bay-Area-News-429.php').then(function(feed){
     $scope.localNews=feed;
     $scope.newsTick=!$scope.newsTick;
    });
  $scope.newsTick=false;
  $scope.sportsTick=false;

$interval(function(){
    //todo: put into dynamic constants
    $scope.localNews=getFeed('http://www.sfgate.com/bayarea/feed/Bay-Area-News-429.php');
  },1000*500);

  $interval(function(){
    //todo: put into dynamic constants
    $scope.localSports=getFeed('http://www.sfgate.com/bayarea/feed/Bay-Area-News-487.php');
  },1000*600);

  $interval(function(){
    $scope.newsTick=!$scope.newsTick;
  },5000);

   $interval(function(){
    $scope.sportsTick=!$scope.sportsTick;
  },5500);

  /*$scope.$watch('geo',function() {
    $log.log('geo ticked');

    weatherApi.getCurrentWeather()
      .then(function(data){
        $scope.currentWeather = data.current_observation;
      });*/
    /*
    weatherApi.getHourlyWeather()
    .then(function(data) {
      //$log.info(data.hourly_forecast);
        $scope.hourlyWeatherA=lodash.map(lodash.slice(data.hourly_forecast,0,12), function(hr){
            hr.local_icon=imageIconRe.exec(hr.icon_url)[1];
            hr.local_time=hr.FCTTIME.civil.replace(' AM','a').replace(' PM','p');
              return hr;
        });

        $scope.hourlyMetaA=lodash.filter(lodash.slice(data.hourly_forecast,0,12), function(hr){

            return hr.FCTTIME.civil;
        });

        console.log('hourly meta?',$scope.hourlyMetaA);

         $scope.hourlyWeatherB=lodash.map(lodash.slice(data.hourly_forecast,12,24), function(hr){
            hr.local_icon=imageIconRe.exec(hr.icon_url)[1];
            hr.local_time=hr.FCTTIME.civil.replace(' AM','a').replace(' PM','p');

              return hr;
        });
        //$scope.hourlyWeather=data.hourly_forecast;
    });
  }, true);
*/
  $scope.alerts=[];
  //asynch load

  uiGmapIsReady.promise().then(function(){
      $log.warn('map ready? uiGmapIsReady ticked');
      $scope.mapReady=true;
    });

  uiGmapGoogleMapApi.then(function() {
         var mapOptions = {
           panControl: false,
           zoomControl: false,
           scaleControl: false,
           mapTypeControl: true,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };

    $log.warn('gmaps api loaded');
      $scope.$watch('data.geo', function(val) {
        $log.warn('geo.data changed', val);

       if( typeof val !== 'undefined') {

         $scope.map = {
           center: {
             latitude: $scope.data.geo.lat,
             longitude: $scope.data.geo.lon
           },
           zoom: 11,
           options: mapOptions
         };
       }

      }, true);
  });

  function init() {

    //todo: this would become a throwaway token upon impl of auth/identity
    //$scope.uuid=rfc4122.v4();
    $scope.data.clientId=rfc4122.v4();

    $scope.$watch('data.geo', function(newVal,oldVal){

      console.log('watch ticd',newVal);
      console.log('watch ticd',oldVal);
      if(($scope.sentGetTopics===false)&&(typeof newVal !== 'undefined')) {
        $log.log('#####geo tic',newVal);

          var initData={};
          angular.copy($scope.data.geo,initData);
          initData.clientId=$scope.data.clientId;

          dispatchService.initTopics(initData);
          //todo: check if this distance is x threshold from oldVal to account for moving clients
      }
    }, true);

    mySocket.on('connect', function (event, data) {
		  console.info('Socket.io is connected'+event+data);
	  });

    mySocket.on('pong', function (data) {
      console.log('mySocket.pong', data);
    });

    mySocket.on('pulse', function (data){

      console.info('got a pulse', data);
    });

    mySocket.emit('ping');


    if (typeof ENV.wundergroundApiKey === 'undefined') {
        addAlert({'msg':'Error! missing the WUNDERGROUNDAPIKEY environment variable. get one here <a href="http://www.wunderground.com/weather/api/"> wunderground api </a> and set this in your environment to run the weather API calls','type':'danger'});
    }
    if(!assertGeoAuth()) {
      getGeo().then(function(){
        console.info('i resolved my getGeo promise!');
      });
    }
  }
  init();

  function addAlert(alert) {
    $scope.alerts.push(alert);
  }

  $scope.getGeo = function() {
     getGeo().then(function(){
       console.info('i resolved my getGeo promise!');
     });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  function getGeo() {
    var deferred=$q.defer();

    console.log('in getGeo');
    geolocation.getLocation().then(function(data){
       $scope.data.geo = {lat:data.coords.latitude, lon:data.coords.longitude};
       localStorageService.set('geo',$scope.geo);
       localStorageService.set('authorizedGeo',true);
       deferred.resolve();
      },function(err){
        $log.error('geo failed/refused',err);
        deferred.reject();
    });

    return deferred.promise;
  }

  function assertGeoAuth() {

    if(typeof localStorageService.get('geo') === 'undefined' || localStorageService.get('authorizedGeo') === '0' ||  localStorageService.get('geo') === null ) { return false;
    } else {

       $scope.data.geo=localStorageService.get('geo');
       return true;
     }
  }

});
