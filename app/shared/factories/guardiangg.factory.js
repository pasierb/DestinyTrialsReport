'use strict';

function getGggTierByElo(elo) {
  if (elo < 1100) return 'bronze';
  if (elo < 1300) return 'silver';
  if (elo < 1500) return 'gold';
  if (elo < 1700) return 'platinum';
  return 'diamond';
};

function eloTier(playerElo, player, $filter) {
  if (playerElo) {
    player.ggg = playerElo;
    player.ggg.tier = getGggTierByElo(player.ggg.elo);
    if (player.ggg.rank > 0) {
      player.ggg.rank = '#' + $filter('number', 0)(player.ggg.rank);
    } else if (player.ggg.rank == -1) {
      //player.ggg.rank = 'Placing';
      player.ggg.rank = '-';
    } else if (player.ggg.rank == -2) {
      //player.ggg.rank = 'Inactive';
      player.ggg.rank = '-';
    }
  }
}

angular.module('trialsReportApp')
  .factory('guardianggFactory', function ($filter, guardianGG) {

    var getElo = function (player) {
      return guardianGG.getElo(player.membershipId)
        .then(function (elo) {
          var playerElo = _.find(elo.data, function (arr) {
            return arr.mode === 14;
          });
          eloTier(playerElo, player, $filter);
          return player;
        }).then(function (player) {
          return guardianGG.getSeasonOne(player.membershipId)
          .then(function (elo) {
            if (elo && elo.data && elo.data.data) {
              var seasonElo = _.find(elo.data.data, function (arr) {
              return arr.mode === 14;
            });
            if (seasonElo) {
              player.ggg.seasonOneElo = seasonElo.elo;
            }
            return player;
            }
          })
        }).catch(function () {});
    };

    var getSeasonOne = function (player) {
      return guardianGG.getSeasonOne(player.membershipId)
        .then(function (elo) {
          console.log(elo)
          if (elo && elo.data && elo.data.data) {
            var seasonElo = _.find(elo.data.data, function (arr) {
            return arr.mode === 14;
          });
          if (seasonElo) {
            player.ggg.seasonOneElo = seasonElo.elo;
          }
          return player;
          }
        }).catch(function () {});
    };

    var getTeamElo = function (fireteam) {
      var membershipIds = _.pluck(fireteam, 'membershipId');
      return guardianGG.getTeamElo(_.reject(membershipIds, function(player){ return player == undefined; }))
        .then(function (elo) {
          if (elo && elo.data && elo.data.players) {
            var playerElo;
            _.each(fireteam, function (player) {
              if (player) {
                playerElo = elo.data.players[player.membershipId];
                eloTier(playerElo, player, $filter);
              }
            });
          }
          return fireteam;
        }).catch(function () {});
    };

    var getFireteam = function (mode, membershipId) {
      return guardianGG.getFireteam(mode, membershipId)
        .then(function (result) {
          return result;
        }).catch(function () {});
    };

    return {
      getElo: getElo,
      getTeamElo: getTeamElo,
      getSeasonOne: getSeasonOne,
      getFireteam: getFireteam
    };
  });
