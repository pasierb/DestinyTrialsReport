(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('homeController', homeController);

  function homeController(api, config, definitions, $ocLazyLoad, guardianggFactory, homeFactory, $localStorage, locationChanger, matchesFactory, $routeParams, $scope, statsFactory, $interval, $timeout, $translate, $analytics, $q, $http) {
    $scope.$storage = $localStorage.$default({
      language: 'en',
      platform: true,
      archToggled: false,
      hideStats: false,
      visibility: {
        kdRatio: true,
        mainStats: true,
        weeklyStats: false,
        equipped: {
          tab: true,
          weapons: true,
          armor: true,
          build: true,
          talents: true
        },
        lastMatches: {
          tab: true
        },
        stats: {
          tab: true
        }
      }
    });

    $scope.DestinyCrucibleMapDefinition = DestinyCrucibleMapDefinition;
    $scope.DestinyHazardDefinition = DestinyHazardDefinition;
    $scope.DestinyMedalDefinition = DestinyMedalDefinition;
    $scope.DestinyWeaponDefinition = DestinyWeaponDefinition;
    $scope.DestinyTalentGridDefinition = DestinyTalentGridDefinition;

    $scope.changeLanguage = function () {
      // load new manifest
      $analytics.eventTrack('languageChanged', {category: $localStorage.language});
      $translate.use($localStorage.language);
      return getDefinitions($localStorage, $ocLazyLoad)
        .then(function () {
          $scope.$evalAsync(function() {
            $scope.DestinyCrucibleMapDefinition = DestinyCrucibleMapDefinition;
            $scope.DestinyHazardDefinition = DestinyHazardDefinition;
            $scope.DestinyMedalDefinition = DestinyMedalDefinition;
            $scope.DestinyWeaponDefinition = DestinyWeaponDefinition;
            $scope.DestinyTalentGridDefinition = DestinyTalentGridDefinition;
          });
      });
    };

    $scope.searchedMaps = {};
    var wait;

    $scope.resetMapVars = function () {
      $scope.direction = 'center';
      $scope.mapIndex = 0;
      $scope.showNext = false;
      $scope.showPrev = true;
    };

    $scope.mapInfoAnimClass = '';
    $scope.toggleDirection = function (value) {
      var offset = (value === 'left' ? -1 : 1);
      if ((value === 'right' && $scope.showNext) || ((value === 'left' && $scope.showPrev))){
        $scope.mapInfoAnimClass = 'is-switching-' + value;
        $timeout(function () {
          $scope.mapInfoAnimClass = 'is-waiting-' + value;
          $scope.mapIndex = ($scope.mapIndex + offset);
          var newIndex = ($scope.mapIndex + $scope.mapHistory.length - 1);
          var nextIndex = newIndex + 1;
          $scope.showNext = angular.isDefined($scope.mapHistory[nextIndex]);
          $scope.showPrev = angular.isDefined($scope.mapHistory[newIndex-1]);
          $scope.direction = value;
          $scope.loadMapInfo($scope.mapHistory[newIndex].week);
          $scope.direction = 'center';
        }, 300);
      }
    };

    $scope.setFlawlessRecord = function (leaderboard) {
      if (leaderboard && leaderboard[0]) {
        $scope.lighthouseLeaderboard = [];

        $scope.lighthouseLeaderboard[0] = _.find(leaderboard, function(lb){ return lb.rank == 1; });
        if ($scope.lighthouseLeaderboard[0]) {
          $scope.lighthouseLeaderboard[0].rankSuffix = 'st';
          $scope.lighthouseLeaderboard[0].class = '';
          $scope.lighthouseLeaderboard[0].time = moment.utc(moment.utc($scope.lighthouseLeaderboard[0].period)
            .diff(getTrialsBeginDate($scope.lighthouseLeaderboard[0].period))).format('HH:mm:ss');
        }
        $scope.lighthouseLeaderboard[1] = _.find(leaderboard, function(lb){ return lb.rank == 2; });
        if ($scope.lighthouseLeaderboard[1]) {
          $scope.lighthouseLeaderboard[1].rankSuffix = 'nd';
          $scope.lighthouseLeaderboard[1].class = 'second';
          $scope.lighthouseLeaderboard[1].time = moment.utc(moment.utc($scope.lighthouseLeaderboard[1].period)
            .diff(getTrialsBeginDate($scope.lighthouseLeaderboard[1].period))).format('HH:mm:ss');
        }
        $scope.lighthouseLeaderboard[2] = _.find(leaderboard, function(lb){ return lb.rank == 3; });
        if ($scope.lighthouseLeaderboard[2]) {
          $scope.lighthouseLeaderboard[2].rankSuffix = 'rd';
          $scope.lighthouseLeaderboard[2].class = 'third';
          $scope.lighthouseLeaderboard[2].time = moment.utc(moment.utc($scope.lighthouseLeaderboard[2].period)
            .diff(getTrialsBeginDate($scope.lighthouseLeaderboard[2].period))).format('HH:mm:ss');
        }
      }
    };

    $scope.loadMapInfo = function (week) {
      if ($scope.searchedMaps[week]) {
        var map = $scope.searchedMaps[week];
        $scope.weaponSummary = map.weaponSummary;
        $scope.weaponTotals = map.weaponTotals;
        $scope.mapHistory = map.mapHistory;
        $scope.currentMapInfo = map.mapInfo;
        $scope.gggLoadWeapons($scope.platformValue, $scope.currentMapInfo.start_date, $scope.currentMapInfo.end_date);
        $scope.setFlawlessRecord($scope.currentMapInfo.lighthouseLeaderboard);
      } else {
        return statsFactory.mapStats(week)
          .then(function (mapInfo) {
            $scope.searchedMaps[week] = mapInfo;
            $scope.weaponSummary = mapInfo.weaponSummary;
            $scope.weaponTotals = mapInfo.weaponTotals;
            $scope.mapHistory = mapInfo.mapHistory;
            $scope.currentMapInfo = mapInfo.mapInfo;
            $scope.currentMapInfo.weekText = getRelativeWeekText(moment.utc(mapInfo.mapInfo.start_date), $scope.trialsInProgress, true);
            $scope.currentMapInfo.timeAgo = moment.utc(mapInfo.mapInfo.end_date).fromNow();
            $scope.currentMapInfo.mapImage = $scope.DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].mapImage;
            $scope.currentMapInfo.pgcrImage = $scope.DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].pgcrImage;
            $scope.currentMapInfo.heatmapImage = $scope.DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].heatmapImage;
            $scope.currentMapInfo.name = $scope.DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].name;
            $scope.currentMapInfo.lighthouseLeaderboard = mapInfo.lighthouseLeaderboard;
            $scope.gggLoadWeapons($scope.platformValue, $scope.currentMapInfo.start_date, $scope.currentMapInfo.end_date);
            $scope.setFlawlessRecord($scope.currentMapInfo.lighthouseLeaderboard);
          }
        );
      }
    };

    $scope.resetMapVars();
    getMapFromStorage();

    $scope.adsenseSlots = {
      0: '1401297353',
      1: '4354763755',
      2: '5831496956'
    };

    $scope.subdomain = config.subdomain === 'my';
    $scope.sdOpponents = config.subdomain === 'opponents';

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

    function setCurrentMap(id, week) {
      $scope.currentMapId = id;
      $scope.currentMap = $scope.DestinyCrucibleMapDefinition[id];
      $scope.loadMapInfo(week);
    }

    function getMapFromStorage() {
      $scope.currentMapId = undefined;
      if (angular.isDefined($scope.$storage.currentMap) &&
        angular.isDefined($scope.$storage.currentMap.week)) {
        var map = $localStorage.currentMap;
        if (map && map.id && map.start_date) {
          var today = moment();
          var weekAfterLastMap = moment.utc(map.start_date).day(12);
          if (weekAfterLastMap.isAfter(today)) {
            setCurrentMap(map.id, map.week);
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
            setCurrentMap(result.data[0].referenceId, result.data[0].week);
            $localStorage.currentMap = {
              id: $scope.currentMapId,
              week: result.data[0].week,
              start_date: result.data[0].start_date
            };
          } else {
            setCurrentMap(284635225, 1);
          }
        });
    }

    $scope.toggleStats = function () {
      $scope.hideStats = !$scope.hideStats;
      $scope.$storage.hideStats = $scope.hideStats;
    };

    $scope.searchName = function (name) {
      if (name && name.length > 3) {
        $scope.playerNames = {};
        var membershipType = $scope.platformValue ? 2 : 1;
        return api.searchName(
          name,
          membershipType
        ).then(function (result) {
          $scope.playerNames = result.data;
        });
      }
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
        if (player) {
          homeFactory.refreshInventory($scope.fireteam[index]).then(function (teammate) {
            $scope.$evalAsync($scope.fireteam[index] = teammate);
          });
        }
      });
    };

    $scope.gggLoadWeapons = function (platform, start_date, end_date) {
      $scope.platformNumeric = platform ? 2 : 1;
      var dates = trialsDates;

      if (start_date && end_date) {
        dates = {
          begin:  moment.utc(start_date),
          end:  moment.utc(end_date)
        }
      }

      if ($scope.gggWeapons) {
        return guardianggFactory.getWeapons(
          $scope.platformNumeric,
          dates
        ).then(function (result) {
            $scope.mapInfoAnimClass = '';
            $scope.gggWeapons[$scope.platformNumeric] = result.gggWeapons;
            $scope.gggWeapons[$scope.platformNumeric].show = result.show;
            $scope.gggShow = $scope.gggWeapons[$scope.platformNumeric].show;
          });
      } else {
        $scope.gggShow = false;
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
      $localStorage.platform = ($routeParams.platformName === 'ps');
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
              pgcr.map = $scope.DestinyCrucibleMapDefinition[pgcr.activityDetails.referenceId];
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
          //statsFactory.getPlayerAds($scope.fireteam).then(function (result) {
          //  if (!result) {
              api.getRandomAd().then(function (result) {
                if (result && result.data && result.data[0]) {
                  if ($scope.fireteam[_.random(0, 2)]) {
                    $scope.fireteam[_.random(0, 2)].playerAd = result.data[0];
                  } else {
                    $scope.fireteam[0].playerAd = result.data[0];
                  }
                }
              });
          //  }
          //});

          _.each($scope.fireteam, function (player) {

            if (player) {
              if ($scope.subdomain) {
                statsFactory.getTopWeapons(player);
              } else {
                statsFactory.weaponStats(player);
              }

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

          //var intervalPeriod = 30000;
          //$interval(function () {
          //  //if ($scope.hideStats) {
          //    $scope.refreshInventory($scope.fireteam);
          //    //$interval.cancel(autoRefresh);
          //  //}
          //}, intervalPeriod);

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

    //if (_.isUndefined(config.fireteam)) {
    //  if (!$scope.lighthouseLeaderboard) {
    //    api.lighthouseLeaderboard()
    //    .then(function (results) {
    //      if (results && results.data && results.data.data) {
    //        $scope.lighthouseLeaderboard = [];
    //        _.each(results.data.data, function (entry) {
    //          var period = moment.utc(entry.period);
    //          var trialsBeginDate = getTrialsBeginDate(entry.period);
    //
    //          $scope.lighthouseLeaderboard.push({
    //            map: DestinyCrucibleMapDefinition[entry.map].pgcrImage,
    //            platform: entry.platform,
    //            players: entry.players,
    //            time: moment.utc(period.diff(trialsBeginDate)).format('HH:mm:ss'),
    //            weekText: getRelativeWeekText(trialsBeginDate, $scope.trialsInProgress, false, period)
    //          });
    //        });
    //      }
    //    });
    //  }
    //}

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
