'use strict';

/*jshint camelcase: false */
/*global google*/


/**
 * @ngdoc function
 * @name weatherbotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('MainCtrl', function ($rootScope,$scope, $log, $interval, $q, $http, $timeout, geolocation, localStorageService, ENV, lodash, feedService, mySocket, dispatchService, rfc4122, uiGmapGoogleMapApi, uiGmapIsReady, weatherApi) {

  $scope.sentGetTopics=false;
  $scope.data={};
  $scope.mapReady=false;
  $scope.markers=[];
  var imageIconRe = new RegExp('\.*/([A-Z0-9_-]{1,})\.(?:png|jpg|gif|jpeg)','i');

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
  $rootScope.sportsTickerTick=false;

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
    $interval(function(){
    $rootScope.sportsTickerTick=!$rootScope.sportsTickerTick;
  },3500);




  $scope.$watch('data.geo',function(newVal, oldVal) {
    $log.log('scope geo ticked',oldVal);
    $log.log('scope geo ticked',newVal);

    weatherApi.getCurrentWeather()
      .then(function(data){
        $scope.currentWeather = data.current_observation;

      });

  }, true);


  $scope.alerts=[];
  //asynch load

  uiGmapIsReady.promise().then(function(){
      $log.warn('map ready? uiGmapIsReady ticked');
      $scope.mapReady=true;
    });

  uiGmapGoogleMapApi.then(function() {
         /*var mapOptions = {
           panControl: false,
           zoomControl: false,
           scaleControl: false,
           mapTypeControl: true,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };*/

    var mapOptions = {

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
           zoom: 14,
           options: mapOptions
         };
       }

      }, true);
  });

  function init() {
    //todo: IOS safari looks like it needs some kind of CORS preflight
/*
    $http.get("http://127.0.0.1:8080")
    .success(function(response) {$log.warn('yoyo response::::',response)})
      .error(function(err){
        $log.error(err);

      });
*/

    $scope.$on('tickCurrentWeather',function(){
          var rawWeather=dispatchService.getCurrentWeather();
          $log.info('tickCurrentWeather!!!!!!!',rawWeather.weather);

          lodash.merge($scope.data, rawWeather);


            $scope.data.local_icon=imageIconRe.exec($scope.data.icon_url)[1];

            $log.info('local_icon',$scope.data.local_icon);

    });

    $scope.$on('tickHourlyWeather',function(){

        var hWeather=lodash.values(dispatchService.getHourlyWeather());
        //$log.info('retrieved hourly weather',lodash.values(hWeather));

      //$scope.hWeatherDataA=[];
      $scope.hourlyWeatherA=lodash.map(lodash.slice(hWeather,0,12), function(hr){
          $log.info('hr',hr);
            hr.local_icon=imageIconRe.exec(hr.icon_url)[1];
            hr.local_time=hr.FCTTIME.civil.replace(' AM','a').replace(' PM','p');
              //$log.info(hr);

                //$scope.hWeatherDataA.push(hr.temp.english);

              return hr;
        });
        $scope.hourlyMetaA=lodash.filter(lodash.slice(hWeather,0,12), function(hr){

            return hr.FCTTIME.civil;
        });

        console.log('hourly meta?',$scope.hourlyMetaA);
         $scope.hourlyWeatherB=lodash.map(lodash.slice(hWeather,12,24), function(hr){
            hr.local_icon=imageIconRe.exec(hr.icon_url)[1];
            hr.local_time=hr.FCTTIME.civil.replace(' AM','a').replace(' PM','p');
              return hr;
        });
    });

    //todo: this would become a throwaway token upon impl of auth/identity
    $scope.data.clientId=rfc4122.v4();

    $scope.$watch('data.geo', function(newVal,oldVal){

      console.log('watch ticd',newVal);
      console.log('watch ticd',oldVal);


      $scope.markers.push({id:0,
        coords: {
          latitude: newVal.lat,
          longitude: newVal.lon
        },
        options: {
        }
      });

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
    $scope.doAlertFade=false;

    $scope.showAlert=true;
    $scope.alertMsg=alert.msg;
    $timeout(function(){
      $scope.doAlertFade = true;
      $scope.showAlert=false;
    }, 5000);


  }

  $scope.getGeo = function() {
     getGeo().then(function(){
       console.info('i resolved my getGeo promise!');
     });
  };

  $scope.closeAlert = function() {
    $scope.showAlert=false;
  };

  function getGeo() {

    var deferred=$q.defer();
    $log.info('in getGeo');

    geolocation.getLocation().then(function(data){
      $log.warn('returned from getLocation()', data);
       $scope.data.geo = {lat:data.coords.latitude, lon:data.coords.longitude};
       localStorageService.set('geo',$scope.data.geo);

        $log.info('trying to set localStore.geo',localStorageService.get('geo'));

       deferred.resolve();
      },function(err){
        $log.error('geo failed/refused',err);
        deferred.reject();
    });
    return deferred.promise;
  }

  function assertGeoAuth() {
    $log.info('in assertGeoAuth',localStorageService.get('geo'));
    if(typeof localStorageService.get('geo') === 'undefined' || localStorageService.get('geo') === null) {
      return false;
    } else {
      addAlert({'msg':'<strong>retrieved geolocation from local storage..</strong>','type':'danger'});

        $log.info('assigning data.geo from LS');
       $scope.data.geo=localStorageService.get('geo');
       return true;
     }
  }


   function setMarker(data){
      //$log.info('setMarker',data);
     $scope.markers.push({
       id: $scope.markers.length+1,
       coords: {
         latitude: data.display_location.latitude,
         longitude: data.display_location.longitude
        },
        options: {
          icon: 'assets/icons/gMapMarker.png',
          labelContent: data.temp_f+'&deg;',
          labelClass: 'labels',
          labelAnchor: '20 28'
        }});
   }

   //watch markers
   $scope.$on('setPoi',function() {
     var poi=dispatchService.getPoi();

      lodash.each(poi,function(p){
        setMarker(p);
      });

   });


});
