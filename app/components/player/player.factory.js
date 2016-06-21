'use strict';

function setPastActivities(reversedAct, n, pastActivities) {
  pastActivities.push({
    'id': reversedAct[n].activityDetails.instanceId,
    'standing': reversedAct[n].values.standing.basic.value,
    'date': reversedAct[n].period,
    'dateAgo': moment(reversedAct[n].period).fromNow(),
    'kills': reversedAct[n].values.kills.basic.value,
    'kd': reversedAct[n].values.killsDeathsRatio.basic.value,
    'deaths': reversedAct[n].values.deaths.basic.value,
    'assists': reversedAct[n].values.assists.basic.value
  });
}

function returnStreak(reversedAct, pastActivities, streak, recentActivity) {
  for (var n = 0; n < reversedAct.length; n++) {
    setPastActivities(reversedAct, n, pastActivities);
    reversedAct[n].values.standing.basic.value === recentActivity.standing ? streak++ : streak = 0;
  }
  return streak;
}

function getAbilityCooldown(subclass, ability, tier) {
  if (ability === 'STAT_INTELLECT') {
    switch (subclass) {
      case 'Defender':
      case 'Nightstalker':
      case 'Striker':
      case 'Sunsinger':
        return cooldownsSuperA[tier];
      default:
        return cooldownsSuperB[tier];
    }
  } else if (ability === 'STAT_DISCIPLINE') {
    return cooldownsGrenade[tier];
  } else if (ability === 'STAT_STRENGTH') {
    switch (subclass) {
      case 'Nightstalker':
      case 'Gunslinger':
        return cooldownsMeleeA[tier];
      default:
        return cooldownsMeleeB[tier];
    }
  } else {
    return '-:--';
  }
}

function setStatPercentage(player) {
  if (player.characterInfo && player.characterInfo.stats) {
    var statsWithTiers = ['STAT_INTELLECT', 'STAT_DISCIPLINE', 'STAT_STRENGTH'];
    var stats = ['STAT_INTELLECT', 'STAT_DISCIPLINE', 'STAT_STRENGTH', 'STAT_ARMOR', 'STAT_RECOVERY', 'STAT_AGILITY'];
    for (var s = 0; s < stats.length; s++) {
      var statHash = {};
      statHash.name = stats[s];
      statHash.value = 0;
      if (player.characterInfo.stats[stats[s]]) {
        statHash.value = player.characterInfo.stats[stats[s]].value
      }

      if (statsWithTiers.indexOf(stats[s]) > -1) {
        statHash.normalized = statHash.value > 300 ? 300 : statHash.value;
        statHash.tier = Math.floor(statHash.normalized / 60);
        statHash.tiers = [];
        statHash.remaining = statHash.value;
        for (var t = 0; t < 5; t++) {
          statHash.remaining -= statHash.tiers[t] = statHash.remaining > 60 ? 60 : statHash.remaining;
        }
        statHash.cooldown = getAbilityCooldown(player.characterInfo.subclassName, stats[s], statHash.tier);
        statHash.percentage = 100 * statHash.normalized / 300;
      } else {
        statHash.percentage = 100 * statHash.value / 10;
      }

      player.characterInfo.stats[stats[s]] = statHash;
    }
  }
}

angular.module('trialsReportApp')
  .factory('playerFactory', function () {

    function Player(data, name, character) {
      this.name = name;
      this.membershipId = data.membershipId;
      this.membershipType = data.membershipType;
      if (character.characterBase) {
        this.emblem = this.setEmblem(character.emblemPath, character.backgroundPath);
        this.characterInfo = this.setCharacterInfo(character);
        this.grimoire = character.characterBase.grimoireScore;
      } else {
        this.characterInfo = {characterId: character.characterId};
      }
    }

    Player.prototype.setCharacterInfo = function (character) {
      return {
        characterId: character.characterBase.characterId,
        className: className[character.characterBase.classType],
        classType: character.characterBase.classType,
        level: character.characterLevel,
        stats: character.characterBase.stats
      };
    };

    Player.prototype.replace = function (player, character) {
      player = character;
      return player;
    };

    Player.prototype.setEmblem = function (icon, background) {
      return {
        icon: 'https://www.bungie.net' + icon,
        background: 'https://www.bungie.net' + background
      };
    };

    Player.prototype.setActivities = function (player, activities) {
      player.activities = setActivityData(activities);
      return player;
    };

    Player.prototype.setInventory = function (player, inv) {
      player.inventory = {
        weapons: inv.weapons,
        armor: inv.armors,
        subclass: inv.subclass
      };
      if (player.characterInfo) {
        player.characterInfo.subclassName = inv.subclass.definition.name;
      }
      setStatPercentage(player, inv);
      if (inv.subclass.blink && inv.weapons.shotgun) {
        player.inventory.weapons.hazards.push('Blink Shotgun');
      }
      return player;
    };

    Player.build = function (data, name, character) {
      var player = new Player(data, name, character);
      if (data.characters) {
        var characters = [];
        for (var i = 0; i < data.characters.length; i++) {
          characters.push(new Player(data, name, data.characters[i]));
        }
        player.characters = characters;
      }
      return player;
    };

    return Player;
  });
