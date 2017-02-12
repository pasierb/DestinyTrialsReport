(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('mapsController', mapsController);

  function mapsController($localStorage, $scope, statsFactory, $timeout, tmhDynamicLocale, api) {
    $scope.weaponPercentage = [];
    $scope.lighthouseFilter = 0;
    tmhDynamicLocale.set($localStorage.language);

    $scope.searchedMaps = {};

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

    $scope.setChallenge = function (challenge, endDate) {
      $scope.challenge = undefined;
      if (challenge && challenge[0]) {
        $scope.challenge = challenge[0];
        $scope.challenge.active = moment.utc() < moment.utc(endDate);

        if ($scope.challenge.leaderboard) {
          if ($scope.challenge.leaderboard[0]) {
            $scope.challenge.leaderboard[0].rank = 1;
            $scope.challenge.leaderboard[0].rankSuffix = 'st';
            $scope.challenge.leaderboard[0].class = '';
          }

          if ($scope.challenge.leaderboard[1]) {
            $scope.challenge.leaderboard[1].rank = 2;
            $scope.challenge.leaderboard[1].rankSuffix = 'nd';
            $scope.challenge.leaderboard[1].class = 'second';
          }

          if ($scope.challenge.leaderboard[2]) {
            $scope.challenge.leaderboard[2].rank = 3;
            $scope.challenge.leaderboard[2].rankSuffix = 'rd';
            $scope.challenge.leaderboard[2].class = 'third';
          }
        }
      }
    };

    $scope.setFlawlessRecord = function (leaderboard) {
      $scope.lighthouseLeaderboard = undefined;
      if (leaderboard && leaderboard[0]) {
        if ($scope.lighthouseFilter > 0) {
          leaderboard = _.filter(leaderboard, function(team){ return team.platform == $scope.lighthouseFilter; });
        }
        $scope.lighthouseLeaderboard = _.sortBy(leaderboard, 'period');

        if ($scope.lighthouseLeaderboard[0]) {
          $scope.lighthouseLeaderboard[0].rank = 1;
          $scope.lighthouseLeaderboard[0].rankSuffix = 'st';
          $scope.lighthouseLeaderboard[0].class = '';
          $scope.lighthouseLeaderboard[0].time = moment.utc(moment.utc($scope.lighthouseLeaderboard[0].period)
            .diff(getTrialsBeginDate($scope.lighthouseLeaderboard[0].period))).format('HH:mm:ss');
        }

        if ($scope.lighthouseLeaderboard[1]) {
          $scope.lighthouseLeaderboard[1].rank = 2;
          $scope.lighthouseLeaderboard[1].rankSuffix = 'nd';
          $scope.lighthouseLeaderboard[1].class = 'second';
          $scope.lighthouseLeaderboard[1].time = moment.utc(moment.utc($scope.lighthouseLeaderboard[1].period)
            .diff(getTrialsBeginDate($scope.lighthouseLeaderboard[1].period))).format('HH:mm:ss');
        }

        if ($scope.lighthouseLeaderboard[2]) {
          $scope.lighthouseLeaderboard[2].rank = 3;
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
        $scope.currentMapInfo.name = DestinyCrucibleMapDefinition[map.mapInfo.referenceId].name;
        $scope.getWeaponPercentage(week);
        $scope.setFlawlessRecord($scope.currentMapInfo.lighthouseLeaderboard);
        $scope.setChallenge($scope.currentMapInfo.challenge, $scope.currentMapInfo.end_date);
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
            $scope.currentMapInfo.mapImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].mapImage;
            $scope.currentMapInfo.pgcrImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].pgcrImage;
            $scope.currentMapInfo.heatmapImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].heatmapImage;
            $scope.currentMapInfo.name = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].name;
            $scope.currentMapInfo.lighthouseLeaderboard = mapInfo.lighthouseLeaderboard;
            $scope.currentMapInfo.challenge = mapInfo.challenge;
            $scope.getWeaponPercentage(week);
            $scope.setChallenge($scope.currentMapInfo.challenge, $scope.currentMapInfo.end_date);
          }
        );
      }
    };

    $scope.resetMapVars();
    $scope.challenge = null;
    $scope.lighthouseLeaderboard = null;
    $scope.weaponKills = weaponKills;

    $scope.isPlaylist = function (week) {
      if (!week) {
        if ($localStorage.currentMap && $localStorage.currentMap.week) {
          week = $localStorage.currentMap.week;
        } else {
          week = 45;
        }
      }
      return playlists.hasOwnProperty(week);
    };

    $scope.getPlaylistHeader = function (week) {
      if (!week) {
        if ($localStorage.currentMap && $localStorage.currentMap.week) {
          week = $localStorage.currentMap.week;
        } else {
          week = 45;
        }
      }
      return playlists[week].header;
    };

    $scope.getPlaylistPopover = function (week) {
      if (!week) {
        if ($localStorage.currentMap && $localStorage.currentMap.week) {
          week = $localStorage.currentMap.week;
        } else {
          week = 45;
        }
      }
      var list = [];
      var count = playlists[week].maps.length;
      for (var i=0; i<count; i++) {
        var id = playlists[week].maps[i];
        list.push(DestinyCrucibleMapDefinition[id].name);
      }
      return list.join('<br />');
    };

    $scope.toggleFlawless = function (platform) {
      $scope.lighthouseFilter = platform;
      $scope.setFlawlessRecord($scope.currentMapInfo.lighthouseLeaderboard);
    };

    $scope.getWeaponPercentage = function (week) {
      return api.weaponPercentage(
        week
      ).then(function (result) {
        if (result && result.data && result.data.length > 0) {
          var primary = result.data.filter(function (weapon) {
            return weapon.bucketTypeHash == BUCKET_PRIMARY_WEAPON;
          });
          var special = result.data.filter(function (weapon) {
            return weapon.bucketTypeHash == BUCKET_SPECIAL_WEAPON;
          });
          $scope.weaponPercentage = [primary, special];
        }
        $scope.mapInfoAnimClass = '';
      });
    };

    $scope.setPlatform = function (platformBool) {
      $scope.platformValue = platformBool;
      $localStorage.platform = $scope.platformValue;
      return platformBool;
    };

    $scope.getWeaponTypeByIndex = function (index) {
      switch (index) {
        case 0: return 'Primary';
        case 1: return 'Special';
        case 2: return 'Heavy';
      }
    };

    return api.getCurrentMap()
      .then(function (result) {
        if (result && result.data && result.data[0] && result.data[0].referenceId) {
          $scope.loadMapInfo(result.data[0].week)
        } else {
          $scope.loadMapInfo(45)
        }
      });

  }
})();
