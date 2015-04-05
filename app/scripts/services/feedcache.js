'use strict';

/**
 * @ngdoc service
 * @name weatherbotApp.feedCache
 * @description
 * # feedCache
 * Service in the weatherbotApp.
 */
angular.module('weatherbotApp')
  .factory('feedCache', function () {
   var CACHE_INTERVAL = 1000 * 60 * 5; //5 minutes
  function cacheTimes() {
    if ('CACHE_TIMES' in localStorage) {
      return angular.fromJson(localStorage['CACHE_TIMES']);
    }
    return {};
  }
  function hasCache(name) {
    var CACHE_TIMES = cacheTimes();
    return name in CACHE_TIMES && name in localStorage && new Date().getTime() - CACHE_TIMES[name] < CACHE_INTERVAL;
  }
  return {
    set: function (name, obj) {
      localStorage[name] = angular.toJson(obj);
      var CACHE_TIMES = cacheTimes();
      CACHE_TIMES[name] = new Date().getTime();
      localStorage['CACHE_TIMES'] = angular.toJson(CACHE_TIMES);
    },
    get: function (name) {
      if (hasCache(name)) {
        return angular.fromJson(localStorage[name]);
      }
      return null;
    },
    hasCache: hasCache
  };
});
