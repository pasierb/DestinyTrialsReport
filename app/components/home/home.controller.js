(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('homeController', homeController);

  function homeController(api, config, guardianggFactory, homeFactory, locationChanger, $localStorage, matchesFactory, $popover, $routeParams, $scope, statsFactory, util) {
    $scope.currentMap = DestinyCrucibleMapDefinition[469270447];
    $scope.subdomain = config.subdomain === 'my';
    $scope.sdOpponents = config.subdomain === 'opponents';
    $scope.$storage = $localStorage.$default({
      platform: true
    });

    $scope.DestinyCrucibleMapDefinition = DestinyCrucibleMapDefinition;
    $scope.DestinyHazardDefinition = DestinyHazardDefinition;
    $scope.DestinyMedalDefinition = DestinyMedalDefinition;
    $scope.DestinyWeaponDefinition = DestinyWeaponDefinition;
    $scope.DestinyTalentGridDefinition = DestinyTalentGridDefinition;

    $scope.trialsDates = {
      begin: trialsDates.begin.format('YYYY-MM-DD'),
      end: trialsDates.end.format('YYYY-MM-DD')
    };
    $scope.trialsInProgress = moment().isBefore(trialsDates.end);

    $scope.lighthouseLeaderboard = null;
    $scope.weaponKills = weaponKills;
    $scope.statNamesByHash = statNamesByHash;

    $scope.focusOnPlayers = false;
    $scope.focusOnPlayer = 1;

    $scope.switchFocus = function () {
      $scope.focusOnPlayers = !$scope.focusOnPlayers;
    };

    $scope.shiftPlayerFocus = function (direction) {
      $scope.focusOnPlayer = Math.min(3, Math.max(1, $scope.focusOnPlayer + Math.floor(window.innerWidth / 320) * direction));
    };

    $scope.suggestRecentPlayers = function () {
      if (angular.isUndefined($scope.recentPlayers)) {
        $scope.recentPlayers = {};
        return api.recentTeammates(
          $scope.fireteam[0].membershipId
        ).then(function (result) {
            var recents = {};
            _.each(result.data, function (member) {
              if (member.membershipId !==  $scope.fireteam[0].membershipId) {
                recents[member.displayName] = member;
              }
            });
            $scope.recentPlayers = angular.extend($scope.recentPlayers, recents);
            $scope.recentPlayersCopy = $scope.recentPlayers;
          });
      }
    };

    $scope.filter = function (change) {
      var result = {};
      _.each($scope.recentPlayersCopy, function (value, key) {
        if (angular.lowercase(key).indexOf(angular.lowercase(change)) === 0) {
          result[key] = value;
        }
      });
      $scope.recentPlayers = result;
    };

    $scope.refreshInventory = function (fireteam) {
      _.each(fireteam, function (player, index) {
        homeFactory.refreshInventory($scope.fireteam[index]).then(function (teammate) {
          $scope.$evalAsync($scope.fireteam[index] = teammate);
        });
      });
    };

    $scope.gggLoadWeapons = function (platform) {
      $scope.platformNumeric = platform ? 2 : 1;

      if ($scope.gggWeapons) {
        if (!$scope.gggWeapons[$scope.platformNumeric]) {
          return guardianggFactory.getWeapons(
            $scope.platformNumeric,
            $scope.trialsDates
          ).then(function (result) {
              $scope.gggWeapons[$scope.platformNumeric] = result.gggWeapons;
              $scope.gggWeapons[$scope.platformNumeric].show = result.show;
              $scope.gggShow = $scope.gggWeapons[$scope.platformNumeric].show;
            });
        } else {
          $scope.gggShow = $scope.gggWeapons[$scope.platformNumeric].show;
        }
      }
    };

    $scope.togglePlatform = function () {
      $scope.platformValue = !$scope.platformValue;
      $scope.$storage.platform = $scope.platformValue;
      $scope.gggLoadWeapons($scope.platformValue);
    };

    $scope.setPlatform = function (platformBool) {
      $scope.platformValue = platformBool;
      $scope.$storage.platform = $scope.platformValue;
      $scope.gggLoadWeapons($scope.platformValue);
      return platformBool;
    };

    $scope.getWeaponTypeByIndex = function (index) {
      switch (index) {
        case 0: return 'Primary';
        case 1: return 'Special';
        case 2: return 'Heavy';
      }
    };

    if ($routeParams.playerName) {
      $scope.searchedPlayer = $routeParams.playerName;
    }

    if ($routeParams.platformName) {
      $scope.platformValue = $routeParams.platformName === 'ps';
    } else {
      $scope.platformValue = $scope.$storage.platform;
    }

    if (config.fireteam) {
      $scope.fireteam = config.fireteam;
      $scope.$storage.platform = ($routeParams.platformName === 'ps');
      if ($scope.sdOpponents) {
        $scope.reverseSort = false;
        $scope.opponents = config.data.reverse();
        $scope.opponentsCopy = $scope.opponents;
        $scope.focusOnPlayers = true;

        $scope.filterPlayers = function (change) {
          var result = [];
          _.each($scope.opponentsCopy, function (opponent) {
            if (angular.lowercase(opponent.displayName).indexOf(angular.lowercase(change)) === 0) {
              result.push(opponent);
            }
          });
          $scope.opponents = result;
        };

        $scope.getMatchDetails = function (instanceId) {
          return matchesFactory.getPostGame({id: instanceId})
            .then(function (pgcr) {
              pgcr.map = DestinyCrucibleMapDefinition[pgcr.activityDetails.referenceId];
              $scope.matchResults = pgcr;
            })
        };
      }
      if (angular.isDefined($scope.fireteam[0])) {
        $scope.platformValue = $scope.fireteam[0].membershipType === 2;
        if (($scope.fireteam[0] && $scope.fireteam[1] && $scope.fireteam[2]) || $scope.subdomain) {
          $scope.focusOnPlayers = true;
          var platformUrl = $scope.platformValue ? '/ps/' : '/xbox/';

          guardianggFactory.getTeamElo($scope.fireteam);
          statsFactory.getLighthouseCount($scope.fireteam);

          _.each($scope.fireteam, function (player) {

            if (player) {
              if ($scope.subdomain) {
                statsFactory.getTopWeapons(player);
              } else {
                statsFactory.weaponStats(player);
              }

              api.longestStreak(
                player.membershipId,
                player.characterInfo.characterId
              ).then(function (streak) {
                  if (streak && streak.data) {
                    player.longestStreak = streak.data;
                  }
                });
            }
          });

          if ($scope.fireteam[2] && $scope.fireteam[2].membershipId) {
            if (!$scope.subdomain && !$scope.sdOpponents && angular.isDefined(config.updateUrl)) {
              locationChanger.skipReload()
                .withoutRefresh(platformUrl + $scope.fireteam[0].name + '/' +
                $scope.fireteam[1].name + '/' + $scope.fireteam[2].name, true);
            }
          }
        }
      } else {
        $scope.fireteam = null;
      }
    }

    if (config.gggWeapons) {
      $scope.gggWeapons = {};
      $scope.gggWeapons[config.platformNumeric] = config.gggWeapons.gggWeapons;
      $scope.gggWeapons[config.platformNumeric].show = config.gggWeapons.show;
      $scope.platformNumeric = config.platformNumeric;
      $scope.gggShow = $scope.gggWeapons[config.platformNumeric].show;
    }

    if (_.isUndefined(config.fireteam)) {
      if (!$scope.lighthouseLeaderboard) {
        api.lighthouseLeaderboard()
        .then(function (results) {
          if (results && results.data && results.data.data) {
            $scope.lighthouseLeaderboard = [];
            _.each(results.data.data, function (entry) {
              var period = moment.utc(entry.period);
              var trialsBeginDate = getTrialsBeginDate(entry.period);
              var weeksAgo = trialsDates.begin.diff(trialsBeginDate, 'weeks');

              var header;
              if (weeksAgo === 0) {
                if ($scope.trialsInProgress && period.isAfter(trialsDates.begin)) {
                  header = 'this week';
                } else {
                  header = 'last week';
                }
              } else if (weeksAgo === 1) {
                if ($scope.trialsInProgress) {
                  header = 'last week';
                } else {
                  header = '2 weeks ago';
                }
              } else {
                if (!$scope.trialsInProgress) weeksAgo++;
                header = weeksAgo + ' weeks ago';
              }

              $scope.lighthouseLeaderboard.push({
                map: DestinyCrucibleMapDefinition[entry.map].pgcrImage,
                platform: entry.platform,
                players: entry.players,
                time: moment.utc(period.diff(trialsBeginDate)).format('HH:mm:ss'),
                header: header
              });
            });
          }
        });
      }
    }
  }
})();
