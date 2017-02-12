(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('homeController', homeController);

  function homeController(api, config, guardianggFactory, homeFactory, $localStorage, locationChanger, matchesFactory, $routeParams, $scope, statsFactory, $translate, $analytics, $rootScope, tmhDynamicLocale, $q, $http) {
    $scope.$storage = $localStorage.$default({
      language: 'en',
      platform: true,
      archToggled: false,
      hideStats: false,
      visibility: {
        all: false,
        kdRatio: true,
        mainStats: true,
        weekly: {
          stats: true,
          weapons: true
        },
        mapbased: {
          stats: true,
          weapons: true
        },
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

    tmhDynamicLocale.set($localStorage.language);

    $scope.changeLanguage = function () {
      $translate.use($localStorage.language);
      return getDefinitions($localStorage, $q, $http)
        .then(function () {
          $scope.currentMapInfo.name = DestinyCrucibleMapDefinition[$scope.currentMapInfo.referenceId].name;
          $scope.currentMap = DestinyCrucibleMapDefinition[$scope.currentMapId];
          if ($scope.fireteam) {
            $scope.refreshInventory($scope.fireteam);
          }
      });
    };

    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      document.documentElement.setAttribute('lang', data.language);
      $analytics.eventTrack('languageChanged', {category: $localStorage.language});
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    $scope.trialsDates = {
      begin: trialsDates.begin.format('YYYY-MM-DD'),
      end: trialsDates.end.format('YYYY-MM-DD')
    };
    $scope.trialsInProgress = moment().isBefore(trialsDates.end);

    getMapFromDb();

    $scope.adsenseSlots = {
      0: '1401297353',
      1: '4354763755',
      2: '5831496956'
    };

    $scope.subdomain = config.subdomain === 'my';
    $scope.sdOpponents = config.subdomain === 'opponents';

    $scope.lighthouseLeaderboard = null;
    $scope.weaponKills = weaponKills;

    $scope.focusOnPlayers = false;
    $scope.focusOnPlayer = 1;

    $scope.hideStats = $localStorage.hideStats;

    $scope.switchFocus = function () {
      $scope.focusOnPlayers = !$scope.focusOnPlayers;
    };

    $scope.shiftPlayerFocus = function (direction) {
      $scope.focusOnPlayer = Math.min(3, Math.max(1, $scope.focusOnPlayer + Math.floor(window.innerWidth / 320) * direction));
    };

    function setCurrentMap(id, week) {
      $scope.currentMapId = id;
      $scope.currentMap = DestinyCrucibleMapDefinition[id];
      // $scope.loadMapInfo(week);
      // $scope.loadMapInfo(38);
    }

    function getMapFromStorage() {
      $scope.currentMapId = undefined;
      if (angular.isDefined($localStorage.currentMap)) {
        if (angular.isUndefined($localStorage.currentMap.week)) {
          getMapFromDb();
        } else {
          var map = $localStorage.currentMap;
          if (map && map.id && map.start_date) {
            var today = moment();
            var weekAfterLastMap = moment.utc(map.start_date).day(12);
            if (weekAfterLastMap.isAfter(today)) {
              setCurrentMap(map.id, map.week);
            }
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

    $scope.togglePlatform = function () {
      $scope.platformValue = !$scope.platformValue;
      $localStorage.platform = $scope.platformValue;
    };

    $scope.toggleStats = function () {
      $scope.hideStats = !$scope.hideStats;
      $localStorage.hideStats = $scope.hideStats;
    };

    $scope.playing = false;
    $scope.audio = document.createElement('audio');
    $scope.audio.src = '/assets/media/cena.wav';
    $scope.johnCena = function(badge) {
      if (badge === 'John Cena') {
        $scope.audio.play();
        $scope.playing = true;
      }
    };

    $scope.searchName = function (name) {
      if (name && name.length > 3) {
        var membershipType = $scope.platformValue ? 2 : 1;
        return api.searchName(
          name,
          membershipType
        ).then(function (result) {
          if (result && result.data && result.data.length > 0) {
            $scope.playerNames = result.data;
          }
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

    $scope.getWeaponTypeByIndex = function (index) {
      switch (index) {
        case 0: return 'Primary';
        case 1: return 'Special';
        case 2: return 'Heavy';
      }
    };

    $scope.subclassShort = function (subclass) {
      switch (subclass) {
        case 'Nightstalker' :  return 'Tether';
        case 'Voidwalker'   :  return 'Nova';
        case 'Defender'     :  return 'Bubble';
        case 'Sunbreaker'   :  return 'Hammer';
        case 'Sunsinger'    :  return 'Sunlock';
        case 'Gunslinger'   :  return 'Golden';
        case 'Striker'      :  return 'Striker';
        case 'Stormcaller'  :  return 'Storm';
        case 'Bladedancer'  :  return 'Blade';
      }
    };

    if ($routeParams.playerName) {
      $scope.searchedPlayer = $routeParams.playerName;
    }

    if ($routeParams.platformName) {
      $scope.platformValue = $routeParams.platformName === 'ps';
    } else {
      $scope.platformValue = $localStorage.platform;
    }

    if (config.fireteam) {
      $scope.fireteam = config.fireteam;
      $localStorage.platform = ($routeParams.platformName === 'ps');
      if ($scope.sdOpponents && config.data) {
        $scope.reverseSort = false;
        $scope.opponents = config.data.reverse();
        $scope.opponentsCopy = $scope.opponents;
        $scope.focusOnPlayers = true;
        $scope.archToggled = $localStorage.archToggled;

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
          $localStorage.archToggled = value;
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
          guardianggFactory.getTeamElo($scope.fireteam);

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

        }
      } else {
        $scope.fireteam = null;
      }
    }
  }
})();
