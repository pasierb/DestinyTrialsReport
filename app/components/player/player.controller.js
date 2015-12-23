'use strict';

angular.module('trialsReportApp')
  .controller('playerController', function ($scope, statsFactory, matchesFactory, homeFactory, guardianggFactory) {

    var activityCount = $scope.subdomain ? '200' : '50';
    homeFactory.getActivities($scope.player, activityCount);
    statsFactory.getStats($scope.player);
    statsFactory.getGrimoire($scope.player);
    statsFactory.checkSupporter($scope.player);

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
                return matchTeam.standing.basic.value !== player[0].standing;
              });
              player[0].values.enemyScore = enemyTeam.score;
              player[0].values.dateAgo = moment(match.period).fromNow();
              var matchId = match.activityDetails.instanceId;
              lastMatches[matchId] = player[0];
            }
          });
          $scope.player.activities.lastMatches = lastMatches;
        });
    };

    $scope.getWeaponByHash = function (hash) {
      if ($scope.DestinyWeaponDefinition[hash]) {
        var definition = $scope.DestinyWeaponDefinition[hash];
        if (definition.icon.substr(0, 4) !== 'http') {
          definition.icon = 'https://www.bungie.net' + definition.icon;
        }
        return definition;
      }
    };

    $scope.getWeaponTitle = function (title) {
      switch (title) {
        case 'weaponKillsGrenade': return 'Grenade';
        case 'weaponKillsMelee':   return 'Melee';
        case 'weaponKillsSuper':   return 'Super';
      }
    };

    $scope.getLighthouseCount = function (lighthouseData, subdomain) {
      switch (subdomain) {
        case true: return lighthouseData.characterCount;
        case false: return lighthouseData.accountCount;
      }
    };

    statsFactory.getLighthouseCount($scope.player);
    //statsFactory.getTopWeapons($scope.player);

  });
