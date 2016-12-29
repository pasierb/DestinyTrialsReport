'use strict';

var app = angular.module('trialsReportApp');

app.service('util', [

  function () {
    return new function () {
      var urlRegex = /{(\w+)}/;

      this.buildUrl = function (url, tokens) {
        var match;

        while (match = urlRegex.exec(url)) {
          if (null === tokens[match[1]]) {
            throw 'Missing "' + match[1] + '" for ' + url;
          }
          url = url.replace(match[0], tokens[match[1]]);
        }

        return url;
      };

      this.getApiKey = function (domain) {
        switch (domain) {
          case 'destinytrialsreport.com': return '4b412fb8d30644c8a74f9e7df86f1616';
          case 'trials.report':           return 'd07d015b11284f4ebee6604c7bc0cec7';
          case 'localhost':               return 'ee5c2bf3759e4219a50fa9fd47d47805';
        }
      };

      this.getBuildName = function(column) {
        switch (column) {
          case 1: return 'grenade';
          case 2: return 'jump';
          case 3: return 'super';
          case 4: return 'melee';
          case 6: return 'ability1';
          case 8: return 'ability2';
        }
      };

      this.getDefinitionsByBucket = function(bucketHash) {
        switch (bucketHash) {
          case BUCKET_PRIMARY_WEAPON: return 'primary';
          case BUCKET_SPECIAL_WEAPON: return 'special';
          case BUCKET_HEAVY_WEAPON:   return 'heavy';
          case BUCKET_HEAD:           return 'head';
          case BUCKET_ARMS:           return 'arms';
          case BUCKET_CHEST:          return 'chest';
          case BUCKET_LEGS:           return 'legs';
        }
      }
    };
  }
])
  .factory('RequestFallback', ['$http', '$q', 'util', function($http, $q, util) {
    return function(BASE_URL, endpoint, tokens) {
      var MAX_REQUESTS = 3,
        counter = 1,
        results = $q.defer();

      var request = function(path) {
        $http({method: 'GET', url: path})
          .success(function(response) {
            results.resolve({data: response})
          })
          .error(function() {
            var fallback = 'https://proxy.destinytrialsreport.com/Platform/Destiny/';
            request(fallback + util.buildUrl(endpoint, tokens));
          });
      };

      request(BASE_URL + util.buildUrl(endpoint, tokens));

      return results.promise;
    }
  }]);
