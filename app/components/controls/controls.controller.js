(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('controlsController', controlsController);

  function controlsController(guardianggFactory, homeFactory, inventoryService, $location, locationChanger, $q, $routeParams, $scope, statsFactory, api, $interval, $timeout) {
    if ($routeParams.playerName) {
      $scope.searchedPlayer = $routeParams.playerName;
    }

    $scope.searchMainPlayerbyName = function (name) {
      if (angular.isDefined(name)) {
        $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + name);
      } else {
        if (angular.isDefined($scope.searchedPlayer)) {
          $location.path(($scope.platformValue ? '/ps/' : '/xbox/') + $scope.searchedPlayer);
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
            if (angular.isDefined($scope.fireteam[1].name) || angular.isDefined($scope.fireteam[2].name)) {
              $scope.switchFocus();
              document.activeElement.blur();
            }
            var methods = [
              inventoryService.getInventory(account.membershipType, account),
              statsFactory.getStats(account),
              homeFactory.getActivities(account, '50')
            ];

            $q.all(methods).then(function (results) {
              var teammate = results[0];
              $scope.$evalAsync( $scope.fireteam[index] = teammate );
              $scope.$parent.focusOnPlayer = index + 1;
              if (!$scope.fireteam[0].activities) {
                $scope.fireteam[0].activities = {lastThree: {}, lastMatches: {}};
              }
              statsFactory.getGrimoire($scope.fireteam[index]);
              statsFactory.checkSupporter($scope.fireteam[index]);
              statsFactory.getLighthouseCount($scope.fireteam);
              statsFactory.weaponStats($scope.fireteam[index]);
              guardianggFactory.getTeamElo($scope.fireteam);
              updateUrl($scope, locationChanger);
            });
          }
        });
    };

    $scope.searchedMaps = {};
    var wait;

    $scope.resetMapVars = function() {
      $scope.direction = 'center';
      $scope.mapIndex = 0;
      $scope.showNext = false;
      $scope.showPrev = true;
    };

    $scope.startAnimation = function() {
      if (angular.isDefined(wait)) {
        $interval.cancel(wait);
        wait = undefined;
      }
    };

    $scope.toggleDirection = function (value) {
      if ( angular.isDefined(wait) ) return;

      wait = $interval(function() {
        if ($scope.direction === 'center') {
          $scope.startAnimation();
        }
      }, 100);

      var offset = (value === 'left' ? -1 : 1);
      $scope.mapIndex = ($scope.mapIndex + offset);
      var newIndex = ($scope.mapIndex + $scope.mapHistory.length - 1);
      var nextIndex = newIndex + 1;
      $scope.showNext = angular.isDefined($scope.mapHistory[nextIndex]);
      $scope.showPrev = angular.isDefined($scope.mapHistory[newIndex-1]);
      $scope.direction = value;
      $scope.loadMapInfo($scope.mapHistory[newIndex].referenceId);
      $timeout(function() {
        $scope.direction = 'center';
      }, 800);
    };

    $scope.loadMapInfo = function (referenceId) {
      if ($scope.searchedMaps[referenceId]) {
        var map = $scope.searchedMaps[referenceId];
        $scope.weaponSummary = map.weaponSummary;
        $scope.weaponTotals = map.weaponTotals;
        $scope.mapHistory = map.mapHistory;
        $scope.mapInfo = map.mapInfo;
      } else {
        return statsFactory.mapStats(referenceId)
          .then(function (mapInfo) {
            $scope.searchedMaps[referenceId] = mapInfo;
            $scope.weaponSummary = mapInfo.weaponSummary;
            $scope.weaponTotals = mapInfo.weaponTotals;
            $scope.mapHistory = mapInfo.mapHistory;
            $scope.mapInfo = mapInfo.mapInfo;
            $scope.mapInfo.weekText = getRelativeWeekText(moment.utc(mapInfo.mapInfo.start_date), $scope.trialsInProgress, true);
            $scope.mapInfo.timeAgo = moment.utc(mapInfo.mapInfo.end_date).fromNow();
          }
        );
      }
    };
  }
})();
