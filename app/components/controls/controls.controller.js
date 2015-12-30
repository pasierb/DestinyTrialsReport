(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('controlsController', controlsController);

  function controlsController(guardianggFactory, homeFactory, inventoryService, $location, locationChanger, $q, $routeParams, $scope, statsFactory) {
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
  }
})();
