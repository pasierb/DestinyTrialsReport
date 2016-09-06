(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .directive('armorNodes', armorNodes)
    .directive('weaponNodes', weaponNodes);

  function armorNodes() {
    return {
      restrict: 'A',
      scope: {
        exoticArmor: '=armorNodes',
        hasExotic: '=hasExotic',
        artifact: '=artifact',
        isRoiArtifact: '=isRoiArtifact'
      },
      templateUrl: 'components/inventory/armor.template.html'
    };
  }
  function weaponNodes() {
    return {
      restrict: 'A',
      scope: {
        weapons: '=weaponNodes',
        topWeapons:  '=topWeapons',
        hideStats: '=hideStats'
      },
      templateUrl: 'components/inventory/weapons.template.html'
    };
  }
})();
