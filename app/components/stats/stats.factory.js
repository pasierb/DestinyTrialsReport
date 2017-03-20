'use strict';

angular.module('trialsReportApp')
  .factory('statsFactory', function ($http, bungie, api, $q, $translate) {

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
                'basic': {'value': 100 * stats.activitiesWon.basic.value / stats.activitiesEntered.basic.value},
                'statId': 'activitiesWinPercentage'
              };
            }
          }
          player.stats = stats;
          return player;
        });
    };

    var getPlayer = function (player) {
      return api.getPlayer(
        player.membershipId
      ).then(function (result) {
        var year2,
            year3,
            year1,
            currentWeek,
            currentMap,
            badges = [],
            mapWeapons = [],
            score;

        if (result && result.data && result.data[0]) {
          var data = result.data[0];

          if (data.kills && data.deaths && data.match_count) {
            var deaths = data.deaths == 0 ? 1 : data.deaths;
            var kd = data.kills / deaths;
            year3 = {kd: kd, matches: data.match_count};
          }

          if (data.kills_y2 && data.deaths_y2 && data.match_count_y2) {
            var deathsY2 = data.deaths_y2 == 0 ? 1 : data.deaths_y2;
            var kdY2 = data.kills_y2 / deathsY2;
            year2 = {kd: kdY2, matches: data.match_count_y2};
          }

          if (data.kills_y1 && data.deaths_y1 && data.match_count_y1) {
            var deathsY1 = data.deaths_y1 == 0 ? 1 : data.deaths_y1;
            var kdY1 = data.kills_y1 / deathsY1;
            year1 = {kd: kdY1, matches: data.match_count_y1};
          }

          if (data.flawless) {
            var lighthouseVisits = {yearCount: 0};
            lighthouseVisits.years = {};
            _.each(data.flawless.years, function (values, year) {
              lighthouseVisits.yearCount++;
              lighthouseVisits.years[year] = {year: year, accountCount: values.count};
              if (values.characters) {
                lighthouseVisits.years[year].characters = values.characters;
              }
            });

            if (player) {
              if (player.hasOwnProperty('lighthouse')) {
                angular.extend(player.lighthouse, lighthouseVisits);
              } else {
                player.lighthouse = lighthouseVisits;
              }
            }
          }

          if (data.badges && data.badges[0]) {
            _.each(data.badges, function (badge) {
              badges.push({
                status: badge.title,
                description: badge.text,
                htmlClass: badge.title === 'Challenger' ? 'player-hazard--challenger' : 'player-hazard--joel'
              });
            });
          }

          if (data.charitySupporterStatus && data.charitySupporterStatus[0]) {
            _.each(data.charitySupporterStatus.reverse(), function (badge) {
              badges.push({
                status: badge.status,
                description: badge.description,
                icon: badge.icon,
                htmlClass: 'player-hazard--charity1'
              });
            });
          }

          if (data.supporterStatus && data.supporterStatus[0]) {
            var badgeTitle = data.supporterStatus[0];
            badges.push({
              status: badgeTitle,
              translate: true,
              htmlClass: badgeTitle === 'Donator' ? 'player-hazard--donator' :
                (badgeTitle === 'Twitter Guy' ? 'player-hazard--joel' : 'player-hazard--developer')
            });
          }

          if (data.streak) {
            player.longestStreak = {accountStreak: data.streak.accountStreak};
            var characters = data.streak.characters;
            if (characters && characters[player.characterInfo.characterId]) {
              var character = characters[player.characterInfo.characterId];
              player.longestStreak.characterStreak = character.characterStreak;
            }
          }

          if (data.thisWeek && data.thisWeek[0]) {
            var deathsTw = data.thisWeek[0].deaths == 0 ? 1 : data.thisWeek[0].deaths;
            if (data.thisWeek[0].matches == 0) {
              deathsTw = 0;
            }
            var kdTw = data.thisWeek[0].kills / deathsTw;
            currentWeek = {
              percent: 100 * (data.thisWeek[0].matches - data.thisWeek[0].losses) / data.thisWeek[0].matches,
              wins: (data.thisWeek[0].matches - data.thisWeek[0].losses),
              losses: data.thisWeek[0].losses,
              matches: data.thisWeek[0].matches,
              kills: data.thisWeek[0].kills,
              flawless: data.thisWeek[0].flawless,
              deaths: deathsTw,
              kd: kdTw
            };
          }

          if (data.thisMap && data.thisMap[0]) {
            var deathsTm = data.thisMap[0].deaths == 0 ? 1 : data.thisMap[0].deaths;
            if (data.thisMap[0].matches == 0) {
              deathsTm = 0;
            }
            var kdTm = data.thisMap[0].kills / deathsTm;
            currentMap = {
              percent: 100 * (data.thisMap[0].matches - data.thisMap[0].losses) / data.thisMap[0].matches,
              wins: (data.thisMap[0].matches - data.thisMap[0].losses),
              losses: data.thisMap[0].losses,
              matches: data.thisMap[0].matches,
              kills: data.thisMap[0].kills,
              flawless: data.thisMap[0].flawless,
              deaths: deathsTm,
              kd: kdTm
            };
          }

          if (data.thisMapWeapons && data.thisMapWeapons[0]) {
            _.each(data.thisMapWeapons, function (mapWeapon) {
              var weekWeapon = _.find(player.lastWeapons, function(w){
                return w.itemTypeName == mapWeapon.itemTypeName;
              });
              if (weekWeapon) {
                mapWeapon.sum_headshots = parseInt(mapWeapon.sum_headshots) + parseInt(weekWeapon.sum_headshots)
                mapWeapon.sum_kills = parseInt(mapWeapon.sum_kills) + parseInt(weekWeapon.sum_kills)
              }
              if (parseInt(mapWeapon.sum_kills) > 0) {
                mapWeapons.push(mapWeapon);
              }
            });
          } else {
            if (player.lastWeapons) {
              mapWeapons = player.lastWeapons
            }
          }

          if (data.challenge && data.challenge.score) {
            score = data.challenge.score;
          }
        }

        player.year2 = year2;
        player.year3 = year3;
        player.year1 = year1;
        player.badges = badges;
        player.totalBadges = badges.length;
        player.currentWeek = currentWeek;
        player.currentMap = currentMap;
        player.mapWeapons = mapWeapons;
        player.challengeScore = score;
        return player;
      });
    };

    var getChallengeWeapons = function (player) {
      var dfd = $q.defer();
      return api.challengeWeapons(
        player.membershipId
      ).then(function (result) {
        if (result && result.data) {
          var weapons = [],
              challengeWeapons = [],
              weaponDef;

          _.each(result.data, function (weapon) {
            if (_.isObject(weapon)) {
              weaponDef = DestinyWeaponDefinition[weapon.id];
              if (weaponDef) {
                weaponDef.id = weapon.id;
                weaponDef.kills = weapon.kills;
                if (weapon.multiplier) {
                  weaponDef.multiplier = weapon.multiplier;
                } else {
                  weaponDef.headshots = weapon.headshots;
                }
                weapons.push(weaponDef);
              }
            } else {
              weaponDef = DestinyWeaponDefinition[weapon];
              if (weaponDef) {
                weaponDef.id = weapon;
                weapons.push(weaponDef);
              }
            }
          });

          var sorted = _.sortBy(weapons, function (w) { return -w.tierType; });

          while (sorted.length) {
            challengeWeapons.push(sorted.splice(0, 2))
          }

          player.challengeWeapons = challengeWeapons;
          dfd.resolve(player);
          return dfd.promise;
        }
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
                precision: 100 * weapon.headshots / weapon.kills,
                kills: weapon.kills,
                headshots: weapon.headshots,
                win_percentage: weapon.win_percentage,
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
      if (player && player.inventory) {
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
                  precision: 100 * weapon.headshots / weapon.kills,
                  kills: weapon.kills,
                  headshots: weapon.headshots,
                  win_percentage: weapon.win_percentage
                };
              });
              player.topWeapons = topWeapons;
              dfd.resolve(player);
              return dfd.promise;
            }
          });
      }
    };

    var mapStats = function (weekId) {
      return api.getMapInfo(weekId)
        .then(function (mapInfo) {
          if (mapInfo && mapInfo.data) {
            var kills, sum, typeKills, bucketSum, bucket;
            var mapData = mapInfo.data.map_info[0];
            var weaponTotals = {
              totalSum: 0,
              totalLifetime: 0
            };

            var mapHistory = _.sortBy(mapInfo.data.map_ref, 'first_instance');
            _.each(mapInfo.data.weapon_stats, function (weapon) {
              bucket = itemTypeNameToBucket[weapon.weapon_type];
              weapon.bucket = bucketHashToName[bucket];
            });

            var weaponsByBucket = _.groupBy(mapInfo.data.weapon_stats, 'bucket');
            _.each(['primary', 'special', 'heavy'], function (bucket) {
              kills = _.pluck(weaponsByBucket[bucket], 'kills');
              typeKills = _.pluck(weaponsByBucket[bucket], 'sum_kills');
              sum = _.reduce(kills, function(memo, num){ return memo + parseInt(num); }, 0);
              bucketSum = _.reduce(typeKills, function(memo, num){ return memo + parseInt(num); }, 0);
              weaponTotals.totalSum += parseInt(sum);
              weaponTotals.totalLifetime += parseInt(bucketSum);
              weaponTotals[bucket] = {
                sum: sum,
                bucketSum: bucketSum
              };
            });

            var weaponSummary = _.omit(weaponsByBucket, 'heavy');
            _.each(weaponSummary, function (weapons, key) {
              _.each(weapons, function (weapon) {
                var avgPercentage = 100 * (weapon.sum_kills / weaponTotals[weapon.bucket].bucketSum);
                weapon.killPercentage = 100 * (weapon.kills / weaponTotals[weapon.bucket].sum);
                weapon.diffPercentage = weapon.killPercentage - avgPercentage;
              });
            });

            return {
              weaponSummary: weaponSummary,
              weaponTotals:  weaponTotals,
              mapHistory:    mapHistory,
              mapInfo:       mapData,
              challenge: mapInfo.data.challenge,
              lighthouseLeaderboard: mapInfo.data.lighthouseLeaderboard
            };
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

    return {
      getStats: getStats,
      getGrimoire: getGrimoire,
      getPlayer: getPlayer,
      getTopWeapons: getTopWeapons,
      getPreviousMatches: getPreviousMatches,
      weaponStats: weaponStats,
      mapStats: mapStats,
      getChallengeWeapons: getChallengeWeapons
    };
  });
