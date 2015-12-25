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
            if (result && result.data) {
              var lighthouseVisits = {};
              var accountCount = 0;
              var characterCount = 0;

              var visitsByCharacter = _.groupBy(result.data, 'characterId');
              _.each(visitsByCharacter, function (visits, characterId) {
                var weeks = {};

                _.each(visits, function (visit) {
                  var now = moment.utc(visit.period);
                  var begin = now.clone().day(5).hour(18).minute(0).second(0).millisecond(0);
                  if (now.isBefore(begin)) begin.subtract(1, 'week');

                  var dateBeginTrials = begin.format('YYYY-MM-DD');

                  weeks[dateBeginTrials] = weeks[dateBeginTrials] + 1 || 1;
                });

                var visitsCount = _.size(weeks);
                if (visits[0].membershipId == player.membershipId) {
                  accountCount += visitsCount;
                }
                lighthouseVisits[characterId] = weeks;
                if (characterId == player.characterInfo.characterId) {
                  characterCount = visitsCount;
                }
              });

              if (player.hasOwnProperty('lighthouse')) {
                player.lighthouse.visits = lighthouseVisits;
                player.lighthouse.accountCount = accountCount;
                player.lighthouse.characterCount = characterCount;
              } else {
                player.lighthouse = {
                  visits: lighthouseVisits,
                  accountCount: accountCount,
                  characterCount: characterCount
                };
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
        player.membershipId
      ).then(function (result) {
          if (result && result.data) {
            var topWeapons = {};
            _.each(result.data, function (weapon) {
              topWeapons[weapon.weaponId] = {percision: +(100 * weapon.headshots / weapon.kills).toFixed(), kills: weapon.kills, headshots: weapon.headshots};
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
      getPreviousMatches: getPreviousMatches
    };
  });
