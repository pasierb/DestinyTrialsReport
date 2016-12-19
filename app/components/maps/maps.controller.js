(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('mapsController', mapsController);

  function mapsController(guardianggFactory, $localStorage, $scope, statsFactory, $timeout, tmhDynamicLocale, api) {
    $scope.gggWeapons = {};
    $scope.lighthouseFilter = 0;
    tmhDynamicLocale.set($localStorage.language);

    $scope.searchedMaps = {};

    $scope.resetMapVars = function () {
      $scope.direction = 'center';
      $scope.mapIndex = 0;
      $scope.showNext = false;
      $scope.showPrev = true;
    };

    // TODO
    $scope.challenges = {
      "53": {
        duringTitle: "Get as much kills with a blue weapon as you can",
        afterTitle: "The top 3 challengers that got the <strong>most kills with a blue weapon</strong> this week:",
        leaderboard: JSON.parse('[{"platform":2,"players":["Murdaro"],"amount":"1234","rank":1,"rankSuffix":"st","class":"","time":"00:48:51"},{"platform":2,"players":["nico-andreas"],"amount":"1234","rank":2,"rankSuffix":"nd","class":"second","time":"00:52:03"},{"platform":1,"players":["Durern"],"amount":"1234","rank":3,"rankSuffix":"rd","class":"third","time":"00:53:14"},{"platform":2,"players":["BLACKO-RIP"],"amount":"1234","rank":4},{"platform":1,"players":["Magadian"],"amount":"1234","rank":5},{"platform":1,"players":["Keonelehua"],"amount":"1234","rank":6}]')
      },
      "54": {
        duringTitle: "Get as much kills with a blue weapon as you can",
        afterTitle: "Get as much kills with a blue weapon as you can"
      }
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
            $scope.currentMapInfo.mapImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].mapImage;
            $scope.currentMapInfo.pgcrImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].pgcrImage;
            $scope.currentMapInfo.heatmapImage = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].heatmapImage;
            $scope.currentMapInfo.name = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].name;
            $scope.currentMapInfo.lighthouseLeaderboard = mapInfo.lighthouseLeaderboard;
            $scope.gggLoadWeapons($scope.platformValue, $scope.currentMapInfo.start_date, $scope.currentMapInfo.end_date);
            $scope.setFlawlessRecord($scope.currentMapInfo.lighthouseLeaderboard);
          }
        );
      }
    };

    $scope.resetMapVars();
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

    $scope.setPlatform = function (platformBool) {
      $scope.platformValue = platformBool;
      $localStorage.platform = $scope.platformValue;
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
