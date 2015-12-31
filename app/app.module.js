'use strict';

function getSubdomain() {
  var segments = location.hostname.split('.');
  return segments.length>2?segments[segments.length-3].toLowerCase():null;
  //return 'opponents'
}

function getFromParams(homeFactory, inventoryService, guardianggFactory, api, toastr, bungie, $route, $q) {
  var params = $route.current.params;
  var name = params.playerName || params.playerOne;
  if (angular.isDefined(name)) {
    var platform = params.platformName === 'xbox' ? 1 : 2;
    var subdomain = getSubdomain();

    var getPlayer = function () {
      return homeFactory.getAccount(platform, params.playerName)
        .then(function (result) {
          if (result) {
            var player = result;
            player.searched = true;
            if (subdomain === 'my' || subdomain === 'opponents') {
              return homeFactory.getCharacters(
                player.membershipType,
                player.membershipId,
                params.playerName
              );
            } else {
              return homeFactory.getRecentActivity(player)
                .then(function (resultBNG) {
                  if (resultBNG && resultBNG[0]) {
                    return getFireteam(resultBNG);
                  } else {
                    return guardianFactory.getFireteam('14', player.membershipId)
                      .then(function (resultGGG) {
                        if (resultGGG && resultGGG.data.length > 0) {
                          return resultGGG.data;
                        } else {
                          return getFireteam(resultBNG);
                        }
                      });
                  }
                });
            }
          } else {
            return false;
          }
        });
      },
      getFireteam = function (activities) {
        if (angular.isUndefined(activities[0])) {
          toastr.error('No Trials matches found for player', 'Error');
          return activities;
        }
        return bungie.getPgcr(activities[0].activityDetails.instanceId)
          .then(function(result) {
            var fireteam = [];
            _.each(result.data.Response.data.entries, function(player) {
              if (player.standing === activities[0].values.standing.basic.value) {
                fireteam.push({
                  membershipType: player.player.destinyUserInfo.membershipType,
                  membershipId: player.player.destinyUserInfo.membershipId,
                  name: player.player.destinyUserInfo.displayName
                });
              }
            });
            return fireteam;
          });
      },
      teammatesFromParams = function () {
        var methods = [
          homeFactory.getAccount(platform, params.playerOne),
          homeFactory.getAccount(platform, params.playerTwo),
          homeFactory.getAccount(platform, params.playerThree)
        ];
        return $q.all(methods);
      },
      teammatesFromChars = function (player) {
        if (player) {
          var methods = [];
          angular.forEach(player.characters, function (character) {
            methods.push(character);
          });
          return $q.all(methods);
        } else {
          return false;
        }
      },
      teammatesFromRecent = function (players) {
        if (players && players[0] && !players[0].characterInfo) {
          var playerOne = _.find(players, function(player) {
            return angular.lowercase(player.name) === angular.lowercase(name);
          });
          var methods = [homeFactory.getCharacters(
            playerOne.membershipType,
            playerOne.membershipId,
            playerOne.name
          )];
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
        } else if (players && players.characterInfo) {
          return [players];
        } else {
          return false;
        }
      },
      getInventory = function (players) {
        var methods = [];
        angular.forEach(players, function (player) {
          methods.push(inventoryService.getInventory(player.membershipType, player));
        });
        return $q.all(methods);
      },
      getOpponents = function (player) {
        return api.getOpponents(player.membershipId)
      },
      returnPlayer = function (results) {
        if (results) {
          return {
            fireteam: [results[0],results[1], results[2]],
            subdomain: subdomain,
            updateUrl: params.playerName,
            data: results.data
          };
        } else {
          return {
            fireteam: [],
            subdomain: subdomain
          };
        }
      },
      reportProblems = function (fault) {
        console.log(String(fault));
      };
    if (!$route.current.params.preventLoad) {
      if (params.playerOne) {
        return teammatesFromParams()
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      } else if (subdomain === 'my') {
        return getPlayer()
          .then(teammatesFromChars)
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      } else if (subdomain === 'opponents') {
        return getPlayer()
          .then(getOpponents)
          .then(returnPlayer)
          .catch(reportProblems);
      } else {
        return getPlayer()
          .then(teammatesFromRecent)
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      }
    }
  }
}

function gggWeapons($localStorage, guardianggFactory) {
  var platformNumeric = $localStorage.platform ? 2 : 1;
  return guardianggFactory.getWeapons(
    platformNumeric
  ).then(function (result) {
      return {
        gggWeapons: result,
        platformNumeric: platformNumeric,
        subdomain: getSubdomain()
      };
    });
}

angular
  .module('trialsReportApp', [
    'angulartics',
    'angulartics.google.analytics',
    'angular-loading-bar',
    'mgcrea.ngStrap.modal',
    'mgcrea.ngStrap.popover',
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'toastr',
    'ui.bootstrap.tpls',
    'ui.bootstrap.progressbar',
    'ui.bootstrap.tabs',
    'ui.bootstrap.pagination',
    'angularUtils.directives.dirPagination'
  ]);
