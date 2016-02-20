'use strict';

function buildNode(definedNodes, nodeDef, itemNode, nodeStep) {
  definedNodes.push({
    nodeHash: nodeDef.nodeHash,
    row: nodeDef.row,
    column: nodeDef.column,
    isActivated: itemNode.isActivated,
    stepIndex: itemNode.stepIndex,
    nodeStepHash: nodeDef.steps[itemNode.stepIndex].nodeStepHash,
    perkHashes: nodeDef.steps[itemNode.stepIndex].perkHashes,
    name: nodeStep.name,
    description: nodeStep.description,
    icon: nodeStep.icon,
    affectsQuality: nodeStep.affectsQuality
  });
}

function buildItem(definedItems, item, equippedItem, definedNodes) {
  definedItems.push({
    itemHash: item.itemHash,
    itemLevel: item.itemLevel,
    bucketHash: equippedItem.bucketHash,
    stats: item.stats,
    perks: item.perks,
    primaryStat: item.primaryStat,
    nodes: definedNodes
  });
}

function collectDefinedNodes(talentGrid, item) {
  var definedNodes = [];
  if (talentGrid) {
    for (var n = 0, nlen = item.nodes.length; n < nlen; n++) {
      var nodeDef = talentGrid[n],
        itemNode = item.nodes[n];
      if (itemNode.isActivated === true && nodeDef.column > -1) {
        var nodeStep = nodeDef.steps[itemNode.stepIndex];
        if (nodeStep) {
          if (nodeStep.name && (hiddenNodes.indexOf(nodeStep.nodeStepHash) < 0)) {
            buildNode(definedNodes, nodeDef, itemNode, nodeStep);
          }
        }
      }
    }
  }
  return definedNodes;
}
angular.module('trialsReportApp')
  .factory('inventoryService', function (inventoryFactory, bungie, $q) {
    var getData = function (player) {
      return bungie.getInventory(
        player.membershipType,
        player.membershipId,
        player.characterInfo.characterId,
        '14',
        '21'
      )
      .then(function (result) {
          if (result && result.data && result.data.Response) {
            var equippedItems = result.data.Response.data.buckets.Equippable,
              definedItems = [],
              talentGrid;
            for (var i = 0, len = equippedItems.length; i < len; i++) {
              var equippedItem = equippedItems[i],
                item = equippedItem.items[0];
              if (item) {
                talentGrid = DestinyTalentGridDefinition[item.talentGridHash];
                var definedNodes = collectDefinedNodes(talentGrid, item);
                buildItem(definedItems, item, equippedItem, definedNodes);
              }
            }
            return definedItems;
          }
      });
    };

    var getInventory = function (membershipType, player) {
      var returnInventory = function (membershipType, player) {
          var dfd = $q.defer();
          dfd.resolve(getData(player));

          return dfd.promise;
        },
        inventoryInParallel = function (inventoryItems) {
          var dfd = $q.defer();
          dfd.resolve(inventoryFactory.getData(inventoryItems));

          return dfd.promise;
        },
        setPlayerInventory = function (inventory) {
          var dfd = $q.defer();
          player.setInventory(player, inventory);
          dfd.resolve(player);
          return dfd.promise;
        },
        reportProblems = function (fault) {
          console.log(String(fault));
        };
      return returnInventory(membershipType, player)
        .then(inventoryInParallel)
        .then(setPlayerInventory)
        .catch(reportProblems);
    };

    return {
      getData: getData,
      getInventory: getInventory
    };
  });
