(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .controller('infographicController', infographicController);

  function infographicController($scope, definitions) {

  	function getItemName(id) {
  		return DestinyWeaponDefinition[id].name;
    };

    function getItemIcon(id) {
  		return DestinyWeaponDefinition[id].icon;
    };

    $scope.topWeapons = {
	  primary: [
	    {
	    	name: getItemIcon(1346849289).name, 
	    	icon: getItemIcon(1346849289).icon, 
	    	kills: '129,230,798', 
	    	headshots: '43%'
	    },
	    {
	    	name: getItemIcon(2447423793).name, 
	    	icon: getItemIcon(2447423793).icon, 
	    	kills: '100,260,304', 
	    	headshots: '19%'
	    },
	    {
	    	name: getItemIcon(1173766590).name, 
	    	icon: getItemIcon(1173766590).icon, 
	    	kills: '96,310,476',  
	    	headshots: '35%'
	    }
	  ],
	  secondary: [
	    {
	    	name: getItemIcon(1703777169).name, 
	    	icon: getItemIcon(1703777169).icon, 
	    	kills: '289,408,459', 
	    	headshots: '77%'
	    },
	    {
	    	name: getItemIcon(486279087).name, 
	    	icon: getItemIcon(486279087).icon, 
	    	kills: '78,350,662', 
	    	headshots: '7%'
	    },
	    {
	    	name: getItemIcon(1287343925).name, 
	    	icon: getItemIcon(1287343925).icon, 
	    	kills: '59,670,781',  
	    	headshots: '7%'
	    }
	  ],
	  heavy: [
	    {
	    	name: getItemIcon(2808364178).name, 
	    	icon: getItemIcon(2808364178).icon, 
	    	kills: '42,420,851', 
	    	headshots: ''
	    },
	    {
	    	name: getItemIcon(1551744703).name, 
	    	icon: getItemIcon(1551744703).icon, 
	    	kills: '17,232,574', 
	    	headshots: '35%'
	    },
	    {
	    	name: getItemIcon(1397524041).name, 
	    	icon: getItemIcon(1397524041).icon, 
	    	kills: '9,803,379',  
	    	headshots: ''
	    }
	  ]
	};
  }

})();
