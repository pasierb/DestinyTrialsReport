'use strict';

angular.module('trialsReportApp')
  .factory('statsFactory', function ($http, bungie, api, $q) {

    var getStats = function (player) {
      return bungie.getStats(
        player.membershipType,
        player.membershipId,
        player.characterInfo.characterId,
        '14'
      ).then(function (result) {
          var stats;
          if (angular.isDefined(result.data.Response)) {
            stats = result.data.Response.trialsOfOsiris.allTime;
            if (stats) {
              stats.activitiesWinPercentage = {
                'basic': {'value': +(100 * stats.activitiesWon.basic.value / stats.activitiesEntered.basic.value).toFixed()},
                'statId': 'activitiesWinPercentage'
              };
              stats.activitiesWinPercentage.basic.displayValue = stats.activitiesWinPercentage.basic.value + '%';
            }
          }
          player.stats = stats;
          return player;
        });
    };

    var getGrimoire = function (player) {
      return bungie.getGrimoire(
        player.membershipType,
        player.membershipId,
        '110012'
      ).then(function (result) {
          var lighthouse = false;
          if (angular.isDefined(result.data.Response)) {
            lighthouse = result.data.Response.data.cardCollection.length > 0;
          }
          if (player.hasOwnProperty('lighthouse')) {
            player.lighthouse.grimoire = lighthouse;
          } else {
            player.lighthouse = {grimoire: lighthouse};
          }
          return player;
        });
    };

    var getLighthouseCount = function (fireteam) {
      return api.lighthouseCount(
        _.pluck(fireteam, 'membershipId')
      ).then(function (result) {
          var dfd = $q.defer();
          _.each(fireteam, function (player) {
            var lighthouseVisits = {yearCount: 0};
            if (player && result && result.data) {
              if (result.data[player.membershipId]) {
                lighthouseVisits.years = {};
                _.each(result.data[player.membershipId].years, function (values, year) {
                  lighthouseVisits.yearCount++;
                  lighthouseVisits.years[year] = {year: year, accountCount: values.count};
                  if (values.characters) {
                    lighthouseVisits.years[year].characters = values.characters;
                  }
                });
              }

              if (player) {
                if (player.hasOwnProperty('lighthouse')) {
                  angular.extend(player.lighthouse, lighthouseVisits);
                } else {
                  player.lighthouse = lighthouseVisits;
                }
              }
            }
          });
          dfd.resolve(fireteam);
          return dfd.promise;
        });
    };

    var getTopWeapons = function (player) {
      var dfd = $q.defer();
      return api.topWeapons(
        player.characterInfo.characterId
      ).then(function (result) {
          if (result && result.data) {
            var topWeapons = [];
            _.each(result.data, function (weapon) {
              topWeapons.push({
                weaponId: weapon.weaponId,
                precision: +(100 * weapon.headshots / weapon.kills).toFixed(),
                kills: weapon.kills,
                headshots: weapon.headshots,
                win_percentage: +(1 * weapon.win_percentage).toFixed(),
                total_matches: weapon.total_matches
              });
            });
            player.topWeapons = topWeapons;
            dfd.resolve(player);
            return dfd.promise;
          }
        });
    };

    var weaponStats = function (player) {
      var dfd = $q.defer();
      var pWeapons = player.inventory.weapons;
      var weaponArray = [pWeapons.primary.definition,pWeapons.special.definition,pWeapons.heavy.definition];
      var weaponIds = _.pluck(weaponArray, 'itemHash');
      return api.weaponStats(
        player.membershipId,
        weaponIds
      ).then(function (result) {
          if (result && result.data) {
            var topWeapons = {};
            _.each(result.data, function (weapon) {
              topWeapons[weapon.weaponId] = {
                precision: +(100 * weapon.headshots / weapon.kills).toFixed(),
                kills: weapon.kills,
                headshots: weapon.headshots,
                win_percentage: +(1 * weapon.win_percentage).toFixed()
              };
            });
            player.topWeapons = topWeapons;
            dfd.resolve(player);
            return dfd.promise;
          }
        });
    };


    var getPreviousMatches = function (player) {
      return api.previousMatches(
        player.membershipId
      ).then(function (result) {
          if (result && result.data) {
            return result.data;
          }
        });
    };

    var checkSupporter = function (player) {
      return api.checkSupporterStatus(
        player.membershipId
      ).then(function (result) {
          var nonHazard;
          if (angular.isDefined(result.data)) {
            nonHazard = result.data;
          }
          player.nonHazard = nonHazard;
          return player;
        });
    };

    return {
      getStats: getStats,
      getGrimoire: getGrimoire,
      checkSupporter: checkSupporter,
      getLighthouseCount: getLighthouseCount,
      getTopWeapons: getTopWeapons,
      getPreviousMatches: getPreviousMatches,
      weaponStats: weaponStats
    };
  });
