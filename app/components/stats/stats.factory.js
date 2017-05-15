'use strict';

angular.module('trialsReportApp')
  .factory('statsFactory', function ($http, bungie, api, $q, destinyTRN) {

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
            lastWeapons,
            lastAbilities,
            currentMap,
            badges = [],
            challengeWeapons = [],
            charityIcons= [],
            mapWeapons = [],
            challengeScore;

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
              if (badge.status == 'Jake') {
                charityIcons.push({
                  status: '/assets/img/badges/paw.png',
                  description: badge.description,
                  icon: badge.icon
                });
              } else {
                badges.push({
                  status: badge.status,
                  description: badge.description,
                  icon: badge.icon,
                  htmlClass: 'player-hazard--charity1'
                });
              }
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

          if (data.challenge) {
            var weapons = [],
              weaponDef;

            if (data.challenge.details && data.challenge.details[0] && data.challenge.details[0].displayName) {
              _.each(data.challenge.details, function (weapon) {
                weapons.push({
                  displayName: weapon.displayName,
                  instanceId: weapon.instanceId
                });
              });
              challengeWeapons = weapons;
            } else {
              _.each(data.challenge.details, function (weapon) {
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
            }
            if (data.challenge.score) {
              challengeScore = data.challenge.score;
            }
          }

          if (data.thisWeek && data.thisWeek.weapons) {
            var abilityNames = ['Melee', 'Grenade', 'Super', 'Get it Off!'];
            var matches = _.pluck(data.thisWeek.weapons, 'matches_used');
            var kills = _.pluck(data.thisWeek.weapons, 'sum_kills');
            var abilities = data.thisWeek.weapons.filter(function(w){return abilityNames.indexOf(w.name) > -1});

            var melee = abilities.find(function(w){return w.name == 'Melee'});
            var grenade = abilities.find(function(w){return w.name == 'Grenade'});
            var supers = abilities.find(function(w){return w.name == 'Super'});
            var sticky = abilities.find(function(w){return w.name == 'Get it Off!'});

            player.lastWeaponTotalPlayed = _.reduce(matches, function(memo, num){ return memo + parseInt(num); }, 0);
            player.lastWeaponTotalKills = _.reduce(kills, function(memo, num){ return memo + parseInt(num); }, 0);

            lastWeapons = data.thisWeek.weapons.filter(function(w){return abilityNames.indexOf(w.name) < 0}).splice(0,2);
            lastAbilities = {
              melee: melee ? melee.sum_kills : 0,
              grenade: grenade ? grenade.sum_kills : 0,
              supers: supers ? supers.sum_kills : 0,
              sticky: sticky ? sticky.sum_kills : 0
            };
          }
        }

        player.year2 = year2;
        player.year3 = year3;
        player.year1 = year1;
        player.badges = badges;
        player.charityIcons = charityIcons;
        player.totalBadges = badges.length;
        player.currentWeek = currentWeek;
        player.currentMap = currentMap;
        player.mapWeapons = mapWeapons;
        player.challengeScore = challengeScore;
        player.challengeWeapons = challengeWeapons;
        player.lastWeapons = lastWeapons;
        player.lastAbilities = lastAbilities;
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
                  headshots: weapon.headshots
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

            var abilitySummary = mapInfo.data.ability_stats;
            var abilitySum = _.reduce(abilitySummary, function(total, ability){ return total + parseInt(ability.count); }, 0);
            var abilityTypeSum = _.reduce(abilitySummary, function(total, ability){ return total + parseInt(ability.sum_kills); }, 0);
            _.each(abilitySummary, function (ability) {
              var avgPercentage = 100 * (ability.sum_kills / abilityTypeSum);
              ability.name = ability.statName;
              ability.killPercentage = 100 * (ability.count / abilitySum);
              ability.percentOfTotal = 100 * (ability.count / ability.all_kills);
              ability.diffPercentage = ability.killPercentage - avgPercentage;
            });

            return {
              weaponSummary: weaponSummary,
              abilitySummary: abilitySummary,
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

    function getMMRTier(mmr) {
      if (mmr < 1100) return 'bronze';
      if (mmr < 1300) return 'silver';
      if (mmr < 1500) return 'gold';
      if (mmr < 1700) return 'platinum';
      return 'diamond';
    }

    var getMMR = function (player) {
      return destinyTRN.getMMR(
        player.membershipType,
        player.membershipId
      ).then(function (result) {
        player.mmr = {};
        if (result && result.data && result.data[0]) {
          var data = result.data[0];
          player.mmr = {
            rating: data['rating'],
            matches: data['games'],
            rank: (data['playerank'] && data['playerank']['rank']) ? data['playerank']['rank'] : 'N/A',
            hardened: data['hardenedPct'],
            updated: moment.utc(data['lastGameDate']).fromNow(),
            tier: getMMRTier(data['rating'])
          };
        }
        return player;
      });
    };

    return {
      getMMR: getMMR,
      getStats: getStats,
      getGrimoire: getGrimoire,
      getPlayer: getPlayer,
      getTopWeapons: getTopWeapons,
      getPreviousMatches: getPreviousMatches,
      weaponStats: weaponStats,
      mapStats: mapStats
    };
  });
