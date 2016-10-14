'use strict';

function collectDefinedNodes(talentGrid, item) {
  var nodes = [];
  if (talentGrid) {
    _.each(item.nodes, function (node, index) {
      var definition = talentGrid[index];
      if (node.isActivated === true && definition.c > -1) {
        var stepHash = definition.s[node.stepIndex];
        if (stepHash) {
          var step = DestinyStepsDefinition[stepHash];
          if (step && step.n && (hiddenNodes.indexOf(stepHash) < 0)) {
            nodes.push({
              nodeHash: definition.n,
              column: definition.c,
              row: definition.r,
              nodeStepHash: step.s,
              perkHashes: step.p,
              name: step.n,
              description: step.d,
              icon: step.i
            });
          }
        }
      }
    });
  }
  return nodes;
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

angular.module('trialsReportApp')
  .factory('inventoryService', function (bungie, $q, util) {

    var getData = function (player) {
      return bungie.getInventory(
        player.membershipType,
        player.membershipId,
        player.characterInfo.characterId
      )
      .then(function (result) {
          if (result && result.data && result.data.Response) {
            var equippedItems   = result.data.Response.data.buckets.Equippable,
                armors          = {equipped: {}, artifact: {hazards: []}},
                weapons         = {primary: {}, special: {}, heavy: {}},
                abilities       = {weaponKillsGrenade: {}, weaponKillsSuper: {}, weaponKillsMelee: {}},
                subclass        = {abilities: abilities, build: {}, nodes: {}, displayedNodes: {}};

            _.each(equippedItems, function (equippedItem) {
              var item = equippedItem.items[0];

              if (item) {
                if (_.includes(BUCKET_WEAPONS, equippedItem.bucketHash)) {
                  var bucket = util.getDefinitionsByBucket(equippedItem.bucketHash);
                  weapons[bucket].definition = setItemDefinition(item, DestinyWeaponDefinition);
                  weapons[bucket].nodes = collectDefinedNodes(DestinyTalentGridDefinition[item.talentGridHash], item);
                  weapons[bucket].damage = item.primaryStat.value;

                } else if (_.includes(BUCKET_ARMOR, equippedItem.bucketHash)) {
                  var definition = setItemDefinition(item, DestinyArmorDefinition);
                  if (equippedItem.bucketHash === BUCKET_ARTIFACT) {
                    armors.artifact = definition;

                    var artifactHazard;
                    switch (item.itemHash) {
                      case 2672107536: artifactHazard = ["Radeghast"]; break;
                      case 2672107537: artifactHazard = ["Perun"];     break;
                      case 2672107538: artifactHazard = ["Skorri"];    break;
                      case 2672107540: artifactHazard = ["Felwinter"]; break;
                      case 2672107541: artifactHazard = ["Silmar"];    break;
                      case 2672107542: artifactHazard = ["Jolder"];    break;
                      case 2672107551: artifactHazard = ["Gheleon"];   break;
                      case 2672107539: // Timur
                      case 0:
                      default:
                        artifactHazard = null;
                    }
                    armors.artifact.hazards = artifactHazard;
                  }

                  if (definition.tierType === 6) {
                    armors.equipped.definition = definition;
                    armors.equipped.nodes = collectDefinedNodes(DestinyTalentGridDefinition[item.talentGridHash], item);
                  }

                  if (!armors.equipped.definition && equippedItem.bucketHash === BUCKET_HEAD) {
                    armors.equipped.definition = definition;
                    armors.equipped.nodes = collectDefinedNodes(DestinyTalentGridDefinition[item.talentGridHash], item);
                  }

                } else if (equippedItem.bucketHash === BUCKET_BUILD) {
                  var nodes = collectDefinedNodes(DestinyTalentGridDefinition[item.talentGridHash], item);
                  subclass.nodes = _.reject(nodes, function (node) {
                    return _.includes([5, 7], node.column);
                  });
                  subclass.definition = setItemDefinition(item, DestinySubclassDefinition);

                  subclass.definition.itemHash = item.itemHash;
                  _.each(subclass.nodes, function (node) {
                    subclass.displayedNodes[node.nodeStepHash] = node;
                    subclass.build[util.getBuildName(node.column)] = node;
                  });

                  subclass.displayedNodes = _.reject(subclass.nodes, function (n) {
                    return (_.includes([2, 3, 4], n.column) && n.row === 0);
                  });
                }
              }
            });

            return {
              weapons: weapons,
              armors: armors,
              subclass: subclass
            };
          }
      });
    };

    var getInventory = function (membershipType, player) {
      var returnInventory = function (membershipType, player) {
          var dfd = $q.defer();
          dfd.resolve(getData(player));

          return dfd.promise;
        },
        setPlayerInventory = function (inventory) {
          var dfd = $q.defer();
          if (inventory) {
            player.setInventory(player, inventory);
          }
          dfd.resolve(player);
          return dfd.promise;
        },
        reportProblems = function (fault) {
          console.log(String(fault));
        };
      return returnInventory(membershipType, player)
        .then(setPlayerInventory)
        .catch(reportProblems);
    };

    return {
      getData: getData,
      getInventory: getInventory
    };
  });
