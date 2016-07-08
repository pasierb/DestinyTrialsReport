(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('controlsController', controlsController);

  function controlsController(guardianggFactory, homeFactory, $location, $routeParams, $scope, bungie) {
    if ($routeParams.playerName) {
      $scope.searchedPlayer = $routeParams.playerName;
    }

    function getSubdomain() {
      var segments = location.hostname.split('.');
      return segments.length > 2 ? segments[segments.length - 3].toLowerCase() : null;
    }

    function getFromParams(platform, name) {
      if (angular.isDefined(name)) {
        if (getSubdomain()) {
          $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name);
        }

        var getPlayer = function () {
          return homeFactory.getAccount(platform, name)
            .then(function (result) {
              if (result) {
                var player = result;
                player.searched = true;
                return homeFactory.getRecentActivity(player)
                  .then(function (resultBNG) {
                    if (resultBNG && resultBNG[0]) {
                      return homeFactory.getFireteam(resultBNG);
                    } else {
                      return guardianggFactory.getFireteam('14', player.membershipId)
                        .then(function (resultGGG) {
                          if (resultGGG && resultGGG.data.length > 0) {
                            resultGGG.data.membershipId = player.membershipId;
                            return resultGGG.data;
                          } else {
                            return homeFactory.getFireteam(resultBNG);
                          }
                        });
                    }
                  });
              } else {
                return false;
              }
            });
        };

        var reportProblems = function (fault) {
          console.log(fault);
        };

        return getPlayer()
          .catch(reportProblems);
      }
    }

    $scope.searchMainPlayerbyName = function (name, membershipType) {
      var platform = $scope.platformValue ? 2 : 1;
      if (membershipType) {
        platform = membershipType;
        $scope.platformValue = (platform == 2);
      }
      if (angular.isDefined(name)) {
        if (getSubdomain() && getSubdomain() !== 'staging') {
          $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name);
        } else {
          getFromParams(platform, name).then(function (result) {
            if (result) {
              var teammates = _.filter(result, function (player) {
                return !player.searched;
              });
              var names = _.pluck(teammates, "name")
              $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name + '/' + names.join('/'));
            }
          });
        }
      }
    };

    function updateUrl($scope, locationChanger) {
      if ($scope.fireteam[0] && $scope.fireteam[1] && $scope.fireteam[2]) {
        if ($scope.fireteam[2].membershipId) {
          var platformUrl = $scope.platformValue ? '/ps/' : '/xbox/';
          locationChanger.skipReload()
            .withoutRefresh(platformUrl + $scope.fireteam[0].name + '/' +
            $scope.fireteam[1].name + '/' + $scope.fireteam[2].name, true);
        }
      }
    }

    $scope.searchPlayerbyName = function (name, platform, index) {
      if (angular.isUndefined(name)) {
        return;
      }
      return homeFactory.getAccount(($scope.platformValue ? 2 : 1), name)
        .then(function (account) {
          if (account) {
            var names = {};
            names[0] = $scope.fireteam[0];
            names[1] = $scope.fireteam[1];
            names[2] = $scope.fireteam[2];
            names[index] =  account;
            var platformUrl = $scope.platformValue ? '/ps/' : '/xbox/';
            $location.path(platformUrl + names[0].name + '/' + names[1].name + '/' + names[2].name);
          }
        });
    };
  }
})();
