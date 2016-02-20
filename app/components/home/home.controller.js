(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('homeController', homeController);

  function homeController(api, config, guardianggFactory, homeFactory, $localStorage, $location, locationChanger, matchesFactory, $routeParams, $scope, statsFactory, $interval) {
    $scope.$storage = $localStorage.$default({
      platform: true,
      hideStats: false,
      archToggled: false
    });
    getMapFromStorage();

    $scope.subdomain = config.subdomain === 'my';
    $scope.sdOpponents = config.subdomain === 'opponents';

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

    $scope.hideStats = $scope.$storage.hideStats;

    $scope.switchFocus = function () {
      $scope.focusOnPlayers = !$scope.focusOnPlayers;
    };

    $scope.shiftPlayerFocus = function (direction) {
      $scope.focusOnPlayer = Math.min(3, Math.max(1, $scope.focusOnPlayer + Math.floor(window.innerWidth / 320) * direction));
    };

    function getCurrentMapData(referenceId) {
      return statsFactory.mapStats(referenceId)
        .then(function (mapInfo) {
          $scope.currentMapInfo = mapInfo;
          $scope.currentMapInfo.mapInfo.weekText = getRelativeWeekText(moment.utc(mapInfo.mapInfo.start_date), $scope.trialsInProgress, true);
          $scope.currentMapInfo.mapInfo.timeAgo = moment.utc(mapInfo.mapInfo.end_date).fromNow();
        }
      );
    }

    function setCurrentMap(id) {
      $scope.currentMapId = id;
      $scope.currentMap = DestinyCrucibleMapDefinition[id];
      getCurrentMapData(id);
    }

    function getMapFromStorage() {
      $scope.currentMapId = undefined;
      if (angular.isDefined($scope.$storage.currentMap)) {
        var map = $localStorage.currentMap;
        if (map && map.id && map.start_date) {
          var today = moment();
          var weekAfterLastMap = moment.utc(map.start_date).day(12);
          if (weekAfterLastMap.isAfter(today)) {
            setCurrentMap(map.id);
          }
        }
      }
      if (angular.isUndefined($scope.currentMapId)) {
        getMapFromDb();
      }
    }

    function getMapFromDb() {
      return api.getCurrentMap()
        .then(function (result) {
          if (result && result.data && result.data[0] && result.data[0].referenceId) {
            setCurrentMap(result.data[0].referenceId);
            $scope.$storage.currentMap = {
              id: $scope.currentMapId,
              start_date: result.data[0].start_date
            };
          } else {
            setCurrentMap(284635225);
          }
        });
    }

    $scope.toggleStats = function () {
      $scope.hideStats = !$scope.hideStats;
      $scope.$storage.hideStats = $scope.hideStats;
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
            trialsDates
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
      if ($scope.sdOpponents && config.data) {
        $scope.reverseSort = false;
        $scope.opponents = config.data.reverse();
        $scope.opponentsCopy = $scope.opponents;
        $scope.focusOnPlayers = true;
        $scope.archToggled = $scope.$storage.archToggled;

        $scope.filterPlayers = function (change) {
          var result = [];
          _.each($scope.opponentsCopy, function (opponent) {
            if (angular.lowercase(opponent.displayName).indexOf(angular.lowercase(change)) === 0) {
              result.push(opponent);
            }
          });
          $scope.opponents = result;
        };

        $scope.archEnemies = function (value) {
          $scope.archToggled = value;
          $scope.$storage.archToggled = value;
          if ($scope.archToggled) {
            $scope.opponents = _.chain($scope.opponents).groupBy('displayName').filter(function(v){return v.length > 1}).flatten().value();
          } else {
            $scope.opponents = $scope.opponentsCopy;
          }
        };

        $scope.getMatchDetails = function (instanceId) {
          return matchesFactory.getPostGame({id: instanceId})
            .then(function (pgcr) {
              pgcr.map = DestinyCrucibleMapDefinition[pgcr.activityDetails.referenceId];
              $scope.matchResults = pgcr;
              locationChanger.skipReload()
                .withoutRefresh($routeParams.platformName + '/' + config.updateUrl + '/' + instanceId, true);
            });
        };

        if ($routeParams.instanceId) {
          $scope.getMatchDetails($routeParams.instanceId);
        }

        if ($scope.archToggled) {
          $scope.archEnemies(true);
        }
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
              api.lastWeapons(
                player.characterInfo.characterId
              ).then(function (result) {
                  if (result && result.data) {
                    var matches = _.pluck(result.data, 'matches_used');
                    var kills = _.pluck(result.data, 'sum_kills');
                    player.lastWeaponTotalPlayed = _.reduce(matches, function(memo, num){ return memo + parseInt(num); }, 0);
                    player.lastWeaponTotalKills = _.reduce(kills, function(memo, num){ return memo + parseInt(num); }, 0);
                    player.lastWeapons = result.data;
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

          var intervalPeriod = 45000;
          $interval(function () {
            //if ($scope.hideStats) {
              $scope.refreshInventory($scope.fireteam);
              //$interval.cancel(autoRefresh);
            //}
          }, intervalPeriod);

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

              $scope.lighthouseLeaderboard.push({
                map: DestinyCrucibleMapDefinition[entry.map].pgcrImage,
                platform: entry.platform,
                players: entry.players,
                time: moment.utc(period.diff(trialsBeginDate)).format('HH:mm:ss'),
                weekText: getRelativeWeekText(trialsBeginDate, $scope.trialsInProgress, false, period)
              });
            });
          }
        });
      }
    }

    var methods = [];
    angular.forEach(players, function (player) {
      if (angular.lowercase(player.name) !== angular.lowercase(name)) {
        methods.push(homeFactory.getCharacters(
          player.membershipType,
          player.membershipId,
          player.name
        ));
      }
    });
    return $q.all(methods);

    //$scope.chartLabels = [];
    //$scope.chartValues = [];
    //$scope.nowIndicator = null;
    //$scope.dayIndicators = {};
    //
    //if ($scope.trialsInProgress) {
    //  var now = moment().subtract(1, 'week');
    //}
    //
    //var dayChange = trialsDates.begin.clone().local().subtract(1, 'week').endOf('day');
    //var i = 0;
    //$scope.dayIndicators[i] = {
    //  label: dayChange.format('ddd')
    //};
    //
    //angular.forEach(kdGraphData, function (value, key) {
    //  var dateLabel = moment.utc(value.tmstamp, 'MM/DD/YYYY HH:mm:ss').local();
    //  $scope.chartLabels.push(dateLabel.format('dddd, HH:00'));
    //  $scope.chartValues.push(value.kd);
    //
    //  if ($scope.trialsInProgress) {
    //    if ($scope.nowIndicator === null && now < dateLabel) {
    //      $scope.nowIndicator = key / kdGraphData.length * 100;
    //    }
    //  }
    //
    //  if (dayChange < dateLabel) {
    //    $scope.dayIndicators[i].value = key / kdGraphData.length * 100;
    //
    //    i++;
    //    dayChange = dayChange.clone().add(1, 'hour').endOf('day');
    //    $scope.dayIndicators[i] = {
    //      label: dayChange.format('ddd')
    //    };
    //  }
    //});
    //
    //$scope.chartValues = [$scope.chartValues];
  }
})();
