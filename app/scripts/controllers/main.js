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
  .controller('MainCtrl', function ($scope, $log, $interval, $q, geolocation, localStorageService, ENV, lodash, weatherApi, feedService, socket) {

 /* getFeed('http://www.sfgate.com/bayarea/feed/Bay-Area-News-487.php').then(function(feedData){
    console.log('DEBUG',data);
  })*/

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

  $scope.$watch('geo',function() {
    $log.log('geo ticked');

    weatherApi.getCurrentWeather()
      .then(function(data){
        $scope.currentWeather = data.current_observation;

      });

    weatherApi.getHourlyWeather()
    .then(function(data) {
        var imageIconRe = new RegExp('\.*/([A-Z0-9_-]{1,})\.(?:png|jpg|gif|jpeg)','i');
        //var timeRe = new RegExp('\.*/([A-Z0-9_-]{1,})\.(?:png|jpg|gif|jpeg)','i');
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

  $scope.alerts=[];


  function init() {

    $scope.$watch('geo', function(oldVal, newVal){
        $log.log('#####geo ticked',newVal,oldVal);

        if((newVal!==oldVal)&&(typeof newVal !== 'undefined'))
        {

          //check if this distance is x threshold from oldVal to account for moving clients

        }


    }, true);

    if (typeof ENV.wundergroundApiKey === 'undefined') {
        addAlert({'msg':'Error! missing the WUNDERGROUNDAPIKEY environment variable. get one here <a href="http://www.wunderground.com/weather/api/"> wunderground api </a> and set this in your environment to run the weather API calls','type':'danger'});
    }
    if(!assertGeoAuth()) {
      getGeo();
    }


  }
  init();

  function addAlert(alert) {
    $scope.alerts.push(alert);
  }

  $scope.getGeo = function() {
     getGeo();
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  function getGeo() {
    console.log('getGeo');
   geolocation.getLocation().then(function(data){
     $scope.geo = {lat:data.coords.latitude, long:data.coords.longitude};
     localStorageService.set('geo',$scope.geo);
     localStorageService.set('authorizedGeo',true);
   });
  }

  function assertGeoAuth() {
    if(typeof localStorageService.get('authorizedGeo') === 'undefined' || localStorageService.get('authorizedGeo') === '0' ||  localStorageService.get('authorizedGeo') === null ) { return false;
    } else {
       $scope.geo=localStorageService.get('geo');
       return true;
     }
  }

});
