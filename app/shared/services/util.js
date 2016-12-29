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

      this.domainIsValid = function (domain) {
        var domains = [
          'destinytrialsreport.com',
          'my.destinytrialsreport.com',
          'opponents.destinytrialsreport.com',
          'trials.report',
          'my.trials.report'
        ];

        return _.contains(domains, domain);
      };

      this.getApiKey = function (domain) {
        switch (domain) {
          // oh no dont look!
          case 'destinytrialsreport.com':           return _.sample(['4b412fb8d30644c8a74f9e7df86f1616', '7ca3a8b4abf34db9a838481521f52563']);
          case 'my.destinytrialsreport.com':        return _.sample(['b51e316a69c94461877b17c64bdbae4b', '9dc03577fe9543fea9c61d27f2daf42b']);
          case 'opponents.destinytrialsreport.com': return _.sample(['f729ebd477874cf5be3df82915db3d4e', '7f7a161d0400466587a8b82161c6bb26']);
          case 'trials.report':                     return _.sample(['d07d015b11284f4ebee6604c7bc0cec7', '682fe6a9860f4227b37a72eb7f1afd3f']);
          case 'my.trials.report':                  return _.sample(['9345c6553e7f4e03a77b3b181c15d611', '5bf328ae30ec49edbe99fd355c8f68fd']);
          case 'opponents.trials.report':           return _.sample(['55c4547e8a7a436bb6adc91f42257487', 'a1e2c1490a454cb98dc293f55fe6f236']);
          default:                                  return 'ee5c2bf3759e4219a50fa9fd47d47805';
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
      };

      this.getSubdomain = function(location) {
        var segments = location.split('.');
        if (segments.length > 2) {
          segments.splice(0,1);
        }
        return segments.length > 2 ? segments.splice(0,1)[0].toLowerCase() : null;
      };
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
