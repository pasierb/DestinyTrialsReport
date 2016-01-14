(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .factory('matchesFactory', matchesFactory);

  function matchesFactory($http, $q) {
    var getPostGame = function (recentActivity) {
      return $http({
        method: 'GET',
        url: '//proxy.guardian.gg/Platform/Destiny/Stats/PostGameCarnageReport/' + recentActivity.id + '/'
      }).then(function (resultPostAct) {
        return resultPostAct.data.Response.data;
      }).catch(function () {});
    };

    var getLastThree = function (player) {
      var collectMatches = function (player) {
          var dfd = $q.defer();
          dfd.resolve(player.activities.lastThree);

          return dfd.promise;
        },
        postGameInParallel = function (previousMatches) {
          var methods = [];
          angular.forEach(previousMatches, function (value, key) {
            methods.push(getPostGame(previousMatches[key]));
          });

          return $q.all(methods);
        },
        reportProblems = function (fault) {
          console.log(String(fault));
        };
      return collectMatches(player)
        .then(postGameInParallel)
        .catch(reportProblems);
    };

    return {
      getPostGame: getPostGame,
      getLastThree: getLastThree
    };
  }
})();
