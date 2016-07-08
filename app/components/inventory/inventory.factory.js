/* globals BUCKET_HEAD:false, BUCKET_ARMS:false, BUCKET_CHEST:false, BUCKET_LEGS:false */
/* globals BUCKET_PRIMARY_WEAPON:false, BUCKET_SPECIAL_WEAPON:false, BUCKET_HEAVY_WEAPON:false */

'use strict';

function setHazard(perkHash, object, constant) {
  var hazard;
  if (angular.isString(constant)) {
    hazard = constant;
  } else {
    hazard = constant[perkHash];
  }
  if (hazard) {
    if (angular.isArray(object)) {
      object.push(hazard);
    } else {
      object = hazard;
    }
  }
}

function getDefinitionsByBucket(bucketHash) {
  switch (bucketHash) {
    case BUCKET_PRIMARY_WEAPON: return 'primary';
    case BUCKET_SPECIAL_WEAPON: return 'special';
    case BUCKET_HEAVY_WEAPON:   return 'heavy';
    case BUCKET_HEAD:           return 'head';
    case BUCKET_ARMS:           return 'arms';
    case BUCKET_CHEST:          return 'chest';
    case BUCKET_LEGS:           return 'legs';
  }
}

function getBuildName(column) {
  switch (column) {
    case 1: return 'grenade';
    case 2: return 'jump';
    case 3: return 'super';
    case 4: return 'melee';
    case 6: return 'ability1';
    case 8: return 'ability2';
  }
}


function defineAbilities(subclass) {
  _.each(subclass.nodes, function (node) {
    subclass.displayedNodes[node.nodeStepHash] = node;
    subclass.build[getBuildName(node.column)] = node.nodeStepHash;
  });

  subclass.displayedNodes = _.reject(subclass.nodes, function (n) {
    return (_.includes([2, 3, 4], n.column) && n.row === 0);
  });
}

function setItemDefinition(item, definition) {
  if (item.itemHash in definition) {
    if ('icon' in definition[item.itemHash]) {
      if (definition[item.itemHash].localIcon !== true) {
        if (definition[item.itemHash].icon.substr(0, 4) !== 'http') {
          definition[item.itemHash].icon = 'https://www.bungie.net' + definition[item.itemHash].icon;
        }
      }
    }
    definition[item.itemHash].itemHash = item.itemHash;
    return definition[item.itemHash];
  } else {
    console.log('Classified Item Hash: ' + item.itemHash);
    return {name: 'Classified', description: 'Classified', icon: 'https://www.bungie.net/img/misc/missing_icon.png', subType: 0};
  }
}

function setArmorHazards(armors, itemPerk, weapons) {
  setHazard(itemPerk.perkHash, armors.equipped.hazards, hazardMiscArmorPerks);
  setHazard(itemPerk.perkHash, armors.equipped.hazards, hazardBurnDefense);
  setHazard(itemPerk.perkHash, armors.equipped.increasedArmor, hazardIncreasedArmor);

  if (hazardDoubleGrenadeByPerk[itemPerk.perkHash]) {
    armors.doubleGrenadeHash = hazardDoubleGrenadeByPerk[itemPerk.perkHash];
  }

  if (hazardGrantsAbilty[itemPerk.perkHash]) {
    armors.equipped.grantsClassNode = itemPerk.perkHash;
  }

  if (FORCE_MULTI.indexOf(itemPerk.perkHash) > -1) {
    armors.equipped.forceMultiplier = true;
  }

  if (itemPerkToBucket[itemPerk.perkHash]) {
    weapons[itemPerkToBucket[itemPerk.perkHash]].hazards.push('Fast Reload');
  } else {
    var itemType = reloadPerksToItemType[itemPerk.perkHash];
    if (itemType) {
      var tempItem = weapons[itemTypeToBucket[itemType]];
      if (tempItem.definition.subType === itemType) {
        tempItem.hazards.push('Fast Reload');
      }
    }
  }
}

function setWeaponHazards(item, weapons, bucket, definition) {

  for (var w = 0; w < item.nodes.length; w++) {
    var itemNode = item.nodes[w];
    if (itemNode.isActivated) {
      for (var n = 0; n < itemNode.perkHashes.length; n++) {
        if (hazardMiscWeaponPerks.indexOf(itemNode.perkHashes[n]) > -1) {
          weapons[bucket].hazards.push(itemNode.name);
        }
        if (itemNode.perkHashes[n] === QUICKDRAW) {
          weapons.quickdraw = true;
        }
      }
    }
  }

  if ((definition.subType === 12)) {
    for (var s = 0; s < item.stats.length; s++) {
      if (item.stats[s].statHash === STAT_BASE_DAMAGE && item.stats[s].value >= 16) {
        //if ((item.primaryStat.value * item.stats[i].value) > 8577) {
        weapons[bucket].hazards.push('Revive Kill');
        //}
      }
    }
  } else if (definition.subType === 7) {
    weapons.shotgun = true;
  }
}

angular.module('trialsReportApp')
  .factory('inventoryFactory', function () {
    var getData = function (items) {
      var weaponBuckets = [BUCKET_PRIMARY_WEAPON, BUCKET_SPECIAL_WEAPON, BUCKET_HEAVY_WEAPON];
      var armorBuckets = [BUCKET_HEAD, BUCKET_ARMS, BUCKET_CHEST, BUCKET_LEGS];
      var itemPerk;
      var armors = {
          hazards: [],
          equipped: {
            hazards: []
          }
        };
      var weapons = {
        primary: {
          hazards: []
        },
        special: {
          hazards: []
        },
        heavy: {
          hazards: []
        },
        hazards: [],
        shotgun: false
      };
      var subclass = {
        abilities: {
          weaponKillsGrenade: {},
          weaponKillsSuper: {},
          weaponKillsMelee: {}
        },
        build: {},
        nodes: {},
        displayedNodes: {},
        hazards: []
      };

      for (var n = 0; n < items.length; n++) {
        var item = items[n], bucket = getDefinitionsByBucket(item.bucketHash);
        var definition;

        if (weaponBuckets.indexOf(item.bucketHash) > -1) {
          definition = setItemDefinition(item, DestinyWeaponDefinition);
          weapons[bucket].definition = definition;
          weapons[bucket].nodes = item.nodes;
          weapons[bucket].damage = item.primaryStat.value;
          setWeaponHazards(item, weapons, bucket, definition);

        } else if (armorBuckets.indexOf(item.bucketHash) > -1) {

          definition = setItemDefinition(item, DestinyArmorDefinition);
          for (var a = 0; a < item.perks.length; a++) {
            itemPerk = item.perks[a];
            if (itemPerk.isActive) {
              setArmorHazards(armors, itemPerk, weapons);
            }
          }

          if (definition.tierType === 6) {
            armors.equipped.definition = definition;
            armors.equipped.nodes = item.nodes;
          }

          if (!armors.equipped.definition && item.bucketHash === BUCKET_HEAD) {
            armors.equipped.definition = definition;
            armors.equipped.nodes = item.nodes;
          }

        } else if (item.bucketHash === BUCKET_BUILD) {
          definition = setItemDefinition(item, DestinySubclassDefinition);
          subclass.nodes = _.reject(item.nodes, function (node) {
            return _.includes([5, 7], node.column);
          });
          subclass.definition = definition;
          subclass.definition.itemHash = item.itemHash;
          defineAbilities(subclass);
        }
      }

      if (armors.equipped.increasedArmor) {
        if (armors.equipped.increasedArmor.indexOf(subclass.definition.itemHash) > -1) {
          armors.equipped.hazards.push('Increased Armor');
        }
      }

      if (armors.equipped.grantsClassNode && hazardGrantsAbiltySubclass[subclass.definition.itemHash]) {
        if (hazardGrantsAbiltySubclass[subclass.definition.itemHash].indexOf(armors.equipped.grantsClassNode) > -1) {
          armors.equipped.hazards.push(hazardGrantsAbilty[armors.equipped.grantsClassNode]);
        }
      }

      if (armors.doubleGrenadeHash) {
        if (armors.doubleGrenadeHash === subclass.grenadeHash) {
          armors.equipped.hazards.push('Double Grenade');
        }
      }

      return {
        weapons: weapons,
        armors: armors,
        subclass: subclass
      };
    };

    return {
      getData: getData
    };
  });
