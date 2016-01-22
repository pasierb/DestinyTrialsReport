(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .directive('matchStats', matchStats);

  function matchStats() {
    return {
      restrict: 'A',
      scope: {
        lastMatches: '=matchStats',
        abilities: '=playerAbilities'
      },
      link: function ($scope) {

        $scope.getWeaponTitle = function (title) {
          switch (title) {
            case 'weaponKillsGrenade': return 'Grenade';
            case 'weaponKillsMelee':   return 'Melee';
            case 'weaponKillsSuper':   return 'Super';
          }
        };

        var getWeaponByHash = function (hash) {
          if (DestinyWeaponDefinition[hash]) {
            var definition = DestinyWeaponDefinition[hash];
            if (definition.icon.substr(0, 4) !== 'http') {
              definition.icon = 'https://www.bungie.net' + definition.icon;
            }
            return definition;
          }
        };

        function setOrIncrement(object, value, index) {
          if (object[index]) {
            object[index].count += value.basic.value;
          } else {
            object[index] = {
              id: index,
              count: value.basic.value
            };
          }
        }

        var weapons = {},
          abilityKills = {},
          medals = {},
          allStats = {},
          matchCount = 0;
        _.each($scope.lastMatches, function(match) {
          _.each(match.extended.weapons, function(weapon) {
            var definition = getWeaponByHash(weapon.referenceId);
            if (weapons[weapon.referenceId]) {
              weapons[weapon.referenceId].uniqueWeaponKills += weapon.values.uniqueWeaponKills.basic.value;
              weapons[weapon.referenceId].uniqueWeaponPrecisionKills += weapon.values.uniqueWeaponPrecisionKills.basic.value;
            } else {
              weapons[weapon.referenceId] = {
                referenceId: weapon.referenceId,
                name: definition.name,
                icon: definition.icon,
                uniqueWeaponKills: weapon.values.uniqueWeaponKills.basic.value,
                uniqueWeaponPrecisionKills: weapon.values.uniqueWeaponPrecisionKills.basic.value
              };
            }
          });
          _.each(match.extended.values, function(value, index) {
            if (index.substring(0, 6) === 'medals') {
              setOrIncrement(medals, value, index);
              medals[index].name = DestinyMedalDefinition[index].statName;
              medals[index].description = DestinyMedalDefinition[index].statDescription;
              medals[index].icon = DestinyMedalDefinition[index].iconImage;
            } else if (index.substring(0, 11) === 'weaponKills' && $scope.abilities[index]) {
              setOrIncrement(abilityKills, value, index);
              abilityKills[index].name = $scope.abilities[index].name;
              abilityKills[index].icon = $scope.abilities[index].icon;
            } else {
              setOrIncrement(allStats, value, index);
            }
          });
          setOrIncrement(allStats, match.values.killsDeathsRatio, 'killsDeathsRatio');
          setOrIncrement(allStats, match.values.killsDeathsAssists, 'killsDeathsAssists');
          setOrIncrement(allStats, match.values.assists, 'assists');
          matchCount++;
        });
        $scope.weapons = weapons;
        $scope.abilityKills = abilityKills;
        $scope.medals = medals;
        $scope.allStats = allStats;
        $scope.matchCount = matchCount;
      },
      templateUrl: 'components/matches/matchStats.template.html'
    };
  }
})();
