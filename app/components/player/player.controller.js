'use strict';

angular.module('trialsReportApp')
  .controller('playerController', function ($scope, statsFactory, matchesFactory, homeFactory, $localStorage, guardianggFactory) {

    $scope.getLastMatch = function (player) {
      return matchesFactory.getLastThree(player)
        .then(function (postGame) {
          var lastMatches = {};
          _.each(postGame, function(match) {
            var player = _.filter(match.entries, function(matchPlayer) {
              return matchPlayer.characterId === $scope.player.characterInfo.characterId;
            });
            if (player && player[0]) {
              var enemyTeam = _.find(match.teams, function(matchTeam) {
                return parseInt(matchTeam.teamId) !== parseInt(player[0].values.team.basic.value);
              });
              if (enemyTeam) {
                player[0].values.enemyScore = enemyTeam.score;
              }
              player[0].values.dateAgo = moment(match.period).fromNow();
              var matchId = match.activityDetails.instanceId;
              lastMatches[matchId] = player[0];
            }
          });
          $scope.player.activities.lastMatches = lastMatches;
        });
    };

    var activityCount = $scope.subdomain ? '200' : '50';
    homeFactory.getActivities($scope.player, activityCount)
      .then(function (player) {
        if (!$localStorage.visibility.equipped.tab) {
          if ($localStorage.visibility.lastMatches.tab) {
            $scope.getLastMatch(player);
          }
        }
      });

    // guardianggFactory.getElo($scope.player);
    statsFactory.getStats($scope.player);
    statsFactory.getGrimoire($scope.player);
    statsFactory.getPlayer($scope.player);

    $scope.getWeaponByHash = function (hash) {
      if ($scope.DestinyWeaponDefinition[hash]) {
        var definition = $scope.DestinyWeaponDefinition[hash];
        if (definition.icon.substr(0, 4) !== 'http') {
          definition.icon = 'https://www.bungie.net' + definition.icon;
        }
        return definition;
      }
    };

    $scope.characterLighthouse = function (player, year) {
      var count = 0;
      if (player &&
          player.characterInfo &&
          player.characterInfo.characterId) {
        var characterId = player.characterInfo.characterId;
        if (year.characters &&
            year.characters[characterId]) {
          count = year.characters[characterId].count;
        }
      }
      return count;
    };

    $scope.getLighthouseCount = function (player, subdomain) {
      var years = player.lighthouse.years,
        count = 0,
        character;
      switch (subdomain) {
        case true:
          _.each(years, function (year) {
            character = year.characters[player.characterInfo.characterId];
            if (character) {
              count += character.count;
            }
          });
          return count;
        case false:
          _.each(years, function (year) {
            count += year.accountCount;
          });
          return count;
      }
    };

  });
