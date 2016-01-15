(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('homeController', homeController);

  function homeController(api, config, guardianggFactory, homeFactory, locationChanger, $localStorage, matchesFactory, $popover, $routeParams, $scope, statsFactory, util) {
    $scope.currentMapId = 469270447;
    $scope.currentMap = DestinyCrucibleMapDefinition[$scope.currentMapId];
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

    // TODO: Replace this with a query
    var kdGraphData = [
    	{
    		"tmstamp" : "01/08/2016 18:00:00",
    		"kd" : 1.03243865
    	},
    	{
    		"tmstamp" : "01/08/2016 18:30:00",
    		"kd" : 1.00969091
    	},
    	{
    		"tmstamp" : "01/08/2016 19:30:00",
    		"kd" : 0.99794529
    	},
    	{
    		"tmstamp" : "01/08/2016 20:30:00",
    		"kd" : 0.99276152
    	},
    	{
    		"tmstamp" : "01/08/2016 21:30:00",
    		"kd" : 0.98842322
    	},
    	{
    		"tmstamp" : "01/08/2016 22:30:00",
    		"kd" : 0.98927065
    	},
    	{
    		"tmstamp" : "01/08/2016 23:30:00",
    		"kd" : 0.98960604
    	},
    	{
    		"tmstamp" : "01/09/2016 00:30:00",
    		"kd" : 0.99066625
    	},
    	{
    		"tmstamp" : "01/09/2016 01:30:00",
    		"kd" : 0.99181211
    	},
    	{
    		"tmstamp" : "01/09/2016 02:30:00",
    		"kd" : 0.98850152
    	},
    	{
    		"tmstamp" : "01/09/2016 03:30:00",
    		"kd" : 0.98988093
    	},
    	{
    		"tmstamp" : "01/09/2016 04:30:00",
    		"kd" : 0.98715311
    	},
    	{
    		"tmstamp" : "01/09/2016 05:30:00",
    		"kd" : 0.98901397
    	},
    	{
    		"tmstamp" : "01/09/2016 06:30:00",
    		"kd" : 0.99281022
    	},
    	{
    		"tmstamp" : "01/09/2016 07:30:00",
    		"kd" : 0.99553059
    	},
    	{
    		"tmstamp" : "01/09/2016 08:30:00",
    		"kd" : 0.98810266
    	},
    	{
    		"tmstamp" : "01/09/2016 09:30:00",
    		"kd" : 0.98349152
    	},
    	{
    		"tmstamp" : "01/09/2016 10:30:00",
    		"kd" : 0.97565092
    	},
    	{
    		"tmstamp" : "01/09/2016 11:30:00",
    		"kd" : 0.96835316
    	},
    	{
    		"tmstamp" : "01/09/2016 12:30:00",
    		"kd" : 0.96260206
    	},
    	{
    		"tmstamp" : "01/09/2016 13:30:00",
    		"kd" : 0.95485438
    	},
    	{
    		"tmstamp" : "01/09/2016 14:30:00",
    		"kd" : 0.95019691
    	},
    	{
    		"tmstamp" : "01/09/2016 15:30:00",
    		"kd" : 0.94950629
    	},
    	{
    		"tmstamp" : "01/09/2016 16:30:00",
    		"kd" : 0.95638067
    	},
    	{
    		"tmstamp" : "01/09/2016 17:30:00",
    		"kd" : 0.95954564
    	},
    	{
    		"tmstamp" : "01/09/2016 18:30:00",
    		"kd" : 0.96652162
    	},
    	{
    		"tmstamp" : "01/09/2016 19:30:00",
    		"kd" : 0.97111116
    	},
    	{
    		"tmstamp" : "01/09/2016 20:30:00",
    		"kd" : 0.97618540
    	},
    	{
    		"tmstamp" : "01/09/2016 21:30:00",
    		"kd" : 0.97255721
    	},
    	{
    		"tmstamp" : "01/09/2016 22:30:00",
    		"kd" : 0.97538027
    	},
    	{
    		"tmstamp" : "01/09/2016 23:30:00",
    		"kd" : 0.97679171
    	},
    	{
    		"tmstamp" : "01/10/2016 00:30:00",
    		"kd" : 0.97507569
    	},
    	{
    		"tmstamp" : "01/10/2016 01:30:00",
    		"kd" : 0.97791359
    	},
    	{
    		"tmstamp" : "01/10/2016 02:30:00",
    		"kd" : 0.97883085
    	},
    	{
    		"tmstamp" : "01/10/2016 03:30:00",
    		"kd" : 0.97994314
    	},
    	{
    		"tmstamp" : "01/10/2016 04:30:00",
    		"kd" : 0.98235441
    	},
    	{
    		"tmstamp" : "01/10/2016 05:30:00",
    		"kd" : 0.98952994
    	},
    	{
    		"tmstamp" : "01/10/2016 06:30:00",
    		"kd" : 0.99431033
    	},
    	{
    		"tmstamp" : "01/10/2016 07:30:00",
    		"kd" : 0.99242146
    	},
    	{
    		"tmstamp" : "01/10/2016 08:30:00",
    		"kd" : 0.98846303
    	},
    	{
    		"tmstamp" : "01/10/2016 09:30:00",
    		"kd" : 0.97699168
    	},
    	{
    		"tmstamp" : "01/10/2016 10:30:00",
    		"kd" : 0.96847091
    	},
    	{
    		"tmstamp" : "01/10/2016 11:30:00",
    		"kd" : 0.96425642
    	},
    	{
    		"tmstamp" : "01/10/2016 12:30:00",
    		"kd" : 0.95957356
    	},
    	{
    		"tmstamp" : "01/10/2016 13:30:00",
    		"kd" : 0.95156643
    	},
    	{
    		"tmstamp" : "01/10/2016 14:30:00",
    		"kd" : 0.94959019
    	},
    	{
    		"tmstamp" : "01/10/2016 15:30:00",
    		"kd" : 0.95139120
    	},
    	{
    		"tmstamp" : "01/10/2016 16:30:00",
    		"kd" : 0.95047432
    	},
    	{
    		"tmstamp" : "01/10/2016 17:30:00",
    		"kd" : 0.95881786
    	},
    	{
    		"tmstamp" : "01/10/2016 18:30:00",
    		"kd" : 0.96498242
    	},
    	{
    		"tmstamp" : "01/10/2016 19:30:00",
    		"kd" : 0.96708306
    	},
    	{
    		"tmstamp" : "01/10/2016 20:30:00",
    		"kd" : 0.96690250
    	},
    	{
    		"tmstamp" : "01/10/2016 21:30:00",
    		"kd" : 0.96557104
    	},
    	{
    		"tmstamp" : "01/10/2016 22:30:00",
    		"kd" : 0.96816063
    	},
    	{
    		"tmstamp" : "01/10/2016 23:30:00",
    		"kd" : 0.97327854
    	},
    	{
    		"tmstamp" : "01/11/2016 00:30:00",
    		"kd" : 0.97101070
    	},
    	{
    		"tmstamp" : "01/11/2016 01:30:00",
    		"kd" : 0.97554919
    	},
    	{
    		"tmstamp" : "01/11/2016 02:30:00",
    		"kd" : 0.97853086
    	},
    	{
    		"tmstamp" : "01/11/2016 03:30:00",
    		"kd" : 0.97968526
    	},
    	{
    		"tmstamp" : "01/11/2016 04:30:00",
    		"kd" : 0.98081554
    	},
    	{
    		"tmstamp" : "01/11/2016 05:30:00",
    		"kd" : 0.98384251
    	},
    	{
    		"tmstamp" : "01/11/2016 06:30:00",
    		"kd" : 0.99215596
    	},
    	{
    		"tmstamp" : "01/11/2016 07:30:00",
    		"kd" : 0.99924489
    	},
    	{
    		"tmstamp" : "01/11/2016 08:30:00",
    		"kd" : 0.99570443
    	},
    	{
    		"tmstamp" : "01/11/2016 09:30:00",
    		"kd" : 0.99583038
    	},
    	{
    		"tmstamp" : "01/11/2016 10:30:00",
    		"kd" : 0.98173985
    	},
    	{
    		"tmstamp" : "01/11/2016 11:30:00",
    		"kd" : 0.97758357
    	},
    	{
    		"tmstamp" : "01/11/2016 12:30:00",
    		"kd" : 0.97129300
    	},
    	{
    		"tmstamp" : "01/11/2016 13:30:00",
    		"kd" : 0.96674311
    	},
    	{
    		"tmstamp" : "01/11/2016 14:30:00",
    		"kd" : 0.96725186
    	},
    	{
    		"tmstamp" : "01/11/2016 15:30:00",
    		"kd" : 0.97195099
    	},
    	{
    		"tmstamp" : "01/11/2016 16:30:00",
    		"kd" : 0.97285948
    	},
    	{
    		"tmstamp" : "01/11/2016 17:30:00",
    		"kd" : 0.96713392
    	},
    	{
    		"tmstamp" : "01/11/2016 18:30:00",
    		"kd" : 0.97408160
    	},
    	{
    		"tmstamp" : "01/11/2016 19:30:00",
    		"kd" : 0.97466930
    	},
    	{
    		"tmstamp" : "01/11/2016 20:30:00",
    		"kd" : 0.97855495
    	},
    	{
    		"tmstamp" : "01/11/2016 21:30:00",
    		"kd" : 0.98078537
    	},
    	{
    		"tmstamp" : "01/11/2016 22:30:00",
    		"kd" : 0.98052698
    	},
    	{
    		"tmstamp" : "01/11/2016 23:30:00",
    		"kd" : 0.98476478
    	},
    	{
    		"tmstamp" : "01/12/2016 00:30:00",
    		"kd" : 0.98496419
    	},
    	{
    		"tmstamp" : "01/12/2016 01:30:00",
    		"kd" : 0.98584475
    	},
    	{
    		"tmstamp" : "01/12/2016 02:30:00",
    		"kd" : 0.99070270
    	},
    	{
    		"tmstamp" : "01/12/2016 03:30:00",
    		"kd" : 0.99297187
    	},
    	{
    		"tmstamp" : "01/12/2016 04:30:00",
    		"kd" : 0.99454978
    	},
    	{
    		"tmstamp" : "01/12/2016 05:30:00",
    		"kd" : 1.00200173
    	},
    	{
    		"tmstamp" : "01/12/2016 06:30:00",
    		"kd" : 1.01286311
    	},
    	{
    		"tmstamp" : "01/12/2016 07:30:00",
    		"kd" : 1.01027494
    	},
    	{
    		"tmstamp" : "01/12/2016 08:30:00",
    		"kd" : 1.00804211
    	}
    ];

    $scope.chartLabels = [];
    $scope.chartValues = [];
    $scope.nowIndicator = null;
    $scope.dayIndicators = {};

    if ($scope.trialsInProgress) {
      var now = new moment.utc().local();
    }

    var dayChange = trialsDates.begin.local().endOf('day');
    var i = 0;
    $scope.dayIndicators[i] = {
      label: dayChange.format('ddd')
    };

    angular.forEach(kdGraphData, function (value, key) {
      var dateLabel = new moment.utc(new Date(value.tmstamp)).local();
      $scope.chartLabels.push(dateLabel.format('dddd, HH:00'));
      $scope.chartValues.push(value.kd);

      if ($scope.trialsInProgress) {
        if ($scope.nowIndicator === null && now < dateLabel) {
          $scope.nowIndicator = key / kdGraphData.length * 100;
        }
      }

      if (dayChange < dateLabel) {
        $scope.dayIndicators[i].value = key / kdGraphData.length * 100;

        i++;
        dayChange = dayChange.clone().add('1', 'hour').endOf('day');
        $scope.dayIndicators[i] = {
          label: dayChange.format('ddd')
        };
      }
    });

    $scope.chartValues = [$scope.chartValues];
  }
})();
