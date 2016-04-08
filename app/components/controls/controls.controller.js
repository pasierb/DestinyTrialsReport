(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('controlsController', controlsController);

  function controlsController(guardianggFactory, homeFactory, inventoryService, $location, locationChanger, $q, $routeParams, $scope, statsFactory, api, $window, bungie, toastr) {
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
                      return getFireteam(resultBNG);
                    } else {
                      return guardianggFactory.getFireteam('14', player.membershipId)
                        .then(function (resultGGG) {
                          if (resultGGG && resultGGG.data.length > 0) {
                            resultGGG.data.membershipId = player.membershipId;
                            return resultGGG.data;
                          } else {
                            return getFireteam(resultBNG);
                          }
                        });
                    }
                  });
              } else {
                return false;
              }
            });
        };

        var getFireteam = function (activities) {
          if (angular.isUndefined(activities[0])) {
            toastr.error('No Trials matches found for character', 'Error');
            return [];
          }
          return bungie.getPgcr(activities[0].activityDetails.instanceId)
            .then(function (result) {
              var fireteam = [];
              if (result && result.data && result.data.Response && result.data.Response.data) {
                _.each(result.data.Response.data.entries, function (player) {
                  if (parseInt(player.values.team.basic.value) === parseInt(activities[0].values.team.basic.value)) {
                    if (activities.membershipId && activities.membershipId != player.player.destinyUserInfo.membershipId) {
                      fireteam.push(player.player.destinyUserInfo.displayName);
                    }
                  }
                });
              }
              return fireteam;
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
              $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name + '/' + result.join('/'));
            }
          });
        }
      } else {
        if (angular.isDefined($scope.searchedPlayer)) {
          getFromParams(platform, name).then(function (result) {
            if (result) {
              $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name + '/' + result.join('/'));
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
            //if (($scope.fireteam[1] && angular.isDefined($scope.fireteam[1].name)) || ($scope.fireteam[2] && angular.isDefined($scope.fireteam[2].name))) {
            //  $scope.switchFocus();
            //  document.activeElement.blur();
            //}
            //var methods = [
            //  inventoryService.getInventory(account.membershipType, account),
            //  statsFactory.getStats(account),
            //  homeFactory.getActivities(account, '50')
            //];
            //
            //$q.all(methods).then(function (results) {
            //  var teammate = results[0];
            //  $scope.$evalAsync( $scope.fireteam[index] = teammate );
            //  $scope.$parent.focusOnPlayer = index + 1;
            //  if (!$scope.fireteam[0].activities) {
            //    $scope.fireteam[0].activities = {lastThree: {}, lastMatches: {}};
            //  }
            //  statsFactory.getGrimoire($scope.fireteam[index]);
            //  statsFactory.getPlayer($scope.fireteam[index]);
            //  statsFactory.weaponStats($scope.fireteam[index]);
            //  api.lastWeapons(
            //    $scope.fireteam[index].characterInfo.characterId
            //  ).then(function (result) {
            //      if (result && result.data) {
            //        var matches = _.pluck(result.data, 'matches_used');
            //        var kills = _.pluck(result.data, 'sum_kills');
            //        $scope.fireteam[index].lastWeaponTotalPlayed = _.reduce(matches, function(memo, num){ return memo + parseInt(num); }, 0);
            //        $scope.fireteam[index].lastWeaponTotalKills = _.reduce(kills, function(memo, num){ return memo + parseInt(num); }, 0);
            //        $scope.fireteam[index].lastWeapons = result.data;
            //      }
            //    });
            //  guardianggFactory.getTeamElo($scope.fireteam);
            //  updateUrl($scope, locationChanger);
            //});
          }
        });
    };
  }
})();
