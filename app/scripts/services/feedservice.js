'use strict';

/*global google*/

/**
 * @ngdoc service
 * @name weatherbotApp.feedService
 * @description
 * # feedService
 * Service in the weatherbotApp.
 */
angular.module('weatherbotApp')
    .factory('feedService', ['$q', '$sce', 'feedCache', function ($q, $sce, feedCache) {
      function sanitizeFeedEntry(feedEntry) {
        feedEntry.title = $sce.trustAsHtml(feedEntry.title);
        feedEntry.contentSnippet = $sce.trustAsHtml(feedEntry.contentSnippet);
        feedEntry.content = $sce.trustAsHtml(feedEntry.content);
        feedEntry.publishedDate = new Date(feedEntry.publishedDate).getTime();
        return feedEntry;
      }
      var getFeeds = function (feedURL, count) {
        var deferred = $q.defer();
        if (feedCache.hasCache(feedURL)) {
          return deferred.resolve(sanitizeFeedEntry(feedCache.get(feedURL)));
        }

        console.info('is google obj loaded?', typeof google);
        var feed = new google.feeds.Feed(feedURL);

        if (count) {
          feed.includeHistoricalEntries();
          feed.setNumEntries(count);
        }


        feed.load(function (response) {
          if (response.error) {
            deferred.reject(response.error);
          }
          else {
            feedCache.set(response.feed.entries);
            for (var i = 0; i < response.feed.entries.length; i++) {
              sanitizeFeedEntry(response.feed.entries[i]);
            }
            deferred.resolve(response.feed.entries);
          }
        });
        return deferred.promise;
      };
      return {
        getFeeds: getFeeds
      };
    }]);



