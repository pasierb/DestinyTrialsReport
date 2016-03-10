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
            var rand = _.random(3, 26);
            var fallback = '//trials-api' + rand + '.herokuapp.com/Platform/Destiny/';
            request(fallback + util.buildUrl(endpoint, tokens));
            //if (counter < MAX_REQUESTS) {
            //  request();
            //  counter++;
            //} else {
            //  results.reject("Could not load after multiple tries");
            //}
          });
      };

      request(BASE_URL + util.buildUrl(endpoint, tokens));

      return results.promise;
    }
  }]);
