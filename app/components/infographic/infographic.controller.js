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
	    	name: getItemName(1346849289), 
	    	icon: getItemIcon(1346849289), 
	    	kills: '129,230,798', 
	    	headshots: '43%'
	    },
	    {
	    	name: getItemName(2447423793), 
	    	icon: getItemIcon(2447423793), 
	    	kills: '100,260,304', 
	    	headshots: '19%'
	    },
	    {
	    	name: getItemName(1173766590), 
	    	icon: getItemIcon(1173766590), 
	    	kills: '96,310,476',  
	    	headshots: '35%'
	    }
	  ],
	  secondary: [
	    {
	    	name: getItemName(1703777169), 
	    	icon: getItemIcon(1703777169), 
	    	kills: '289,408,459', 
	    	headshots: '77%'
	    },
	    {
	    	name: getItemName(486279087), 
	    	icon: getItemIcon(486279087), 
	    	kills: '78,350,662', 
	    	headshots: '7%'
	    },
	    {
	    	name: getItemName(1287343925), 
	    	icon: getItemIcon(1287343925), 
	    	kills: '59,670,781',  
	    	headshots: '7%'
	    }
	  ],
	  heavy: [
	    {
	    	name: getItemName(2808364178), 
	    	icon: getItemIcon(2808364178), 
	    	kills: '42,420,851', 
	    	headshots: '0.004%'
	    },
	    {
	    	name: getItemName(1551744703), 
	    	icon: getItemIcon(1551744703), 
	    	kills: '17,232,574', 
	    	headshots: '35%'
	    },
	    {
	    	name: getItemName(1397524041), 
	    	icon: getItemIcon(1397524041), 
	    	kills: '9,803,379',  
	    	headshots: '0.014%'
	    }
	  ]
	};

	$scope.labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", 
	"Week 6", "Week 7", "Week 8", "Week 9","Week 10", "Week 11", "Week 12", 
	"Week 13", "Week 14", "Week 15", "Week 16", "Week 17", "Week 18", "Week 19", 
	"Week 20", "Week 21", "Week 22", "Week 23", "Week 24", "Week 25", "Week 26", 
	"Week 27", "Week 28", "Week 29", "Week 30", "Week 31", "Week 32", "Week 33", 
	"Week 34", "Week 35", "Week 36", "Week 37", "Week 38", "Week 39", "Week 40", 
	"Week 41", "Week 42", "Week 43", "Week 44" ];
  	$scope.dataMatches = [[
                    3328080,
                    2132164,
                    1769366,
                    1239323,
                    1690504,
                    1764930,
                    1666041,
                    1714250,
                    1556543,
                    1201517,
                    1761268,
                    1977349,
                    2218218,
                    1337402,
                    1900060,
                    1676356,
                    2005994,
                    1404408,
                    1904287,
                    1481882,
                    1367986,
                    1493594,
                    1070902,
                    1483247,
                    1811793,
                    1954028,
                    1473531,
                    1634286,
                    1631687,
                    1226230,
                    1570359,
                    1717268,
                    291568,
                    1653389,
                    1147808,
                    1434099,
                    1401740,
                    1093286,
                    1417738,
                    1257058,
                    1472729,
                    1067054,
                    1405374,
                    1712322
                  ]];
        $scope.dataWeeks = [[
                  132791,
                  101189,
                  83764,
                  60248,
                  77435,
                  78200,
                  70954,
                  73221,
                  65314,
                  51591,
                  69425,
                  78701,
                  81800,
                  53871,
                  74412,
                  69351,
                  83203,
                  58380,
                  75684,
                  58173,
                  53540,
                  56730,
                  40995,
                  55857,
                  70103,
                  74862,
                  57040,
                  63296,
                  62785,
                  47246,
                  59770,
                  54382,
                  14231,
                  62888,
                  42310,
                  53377,
                  51094,
                  27104,
                  49216,
                  46929,
                  52338,
                  38673,
                  24139,
                  60378
                ],
                [
                  132791,
                  48749,
                  27374,
                  13080,
                  19081,
                  16253,
                  12279,
                  12654,
                  11089,
                  6746,
                  11903,
                  14669,
                  13684,
                  6452,
                  11457,
                  10598,
                  15439,
                  7346,
                  11509,
                  8393,
                  7187,
                  7763,
                  4282,
                  8072,
                  5607,
                  7019,
                  4815,
                  6016,
                  5940,
                  4777,
                  6503,
                  5446,
                  867,
                  8069,
                  4082,
                  6104,
                  5639,
                  2117,
                  5439,
                  4899,
                  5593,
                  3592,
                  5957,
                  8987
                ]];

  	$scope.datasetOverride = [
      {
        label: "Participating",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "RGBA(107, 198, 189, .30)",
        borderColor: "#009688",
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'bevel',
        pointBorderColor: "#009688",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#009688",
        pointHoverBorderColor: "#01579B",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        spanGaps: false,
      }
    ];

    $scope.datasetsWeeks = [
              {
                label: "Participating",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "RGBA(0, 158, 245, .2)",
                borderColor: "#03A9F4",
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'bevel',
                pointBorderColor: "#03A9F4",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 3,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#03A9F4",
                pointHoverBorderColor: "#01579B",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: false
              },
              {
                label: "Participating",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "#D1C4E9",
                borderColor: "#673AB7",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#673AB7",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 3,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#673AB7",
                pointHoverBorderColor: "#311B92",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: false
              }
            ];
  	$scope.options = {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            ticks: {
                display: false
            }
          }]
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          titleFontStyle: 'normal',
          bodyFontFamily: 'Roboto',
          bodyFontStyle: '300',
          bodySpacing: 10,
          xPadding: 20,
          mode: 'label',
          backgroundColor: 'rgba(0, 0, 0, .6)',
          callbacks: {
            label: function (tooltipItem, data) {
              var label = "";
              if (tooltipItem.datasetIndex === 0) {
                label = '';
              } else if (tooltipItem.datasetIndex === 1) {
                label = 'Reached lighthouse'
              }
              var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
              return label;
            }
          }
        }
    };

    $scope.optionsWeeks = {
            responsive: true,
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                display: false
              }],
              xAxes: [{
                ticks: {
                    display: false
                }
              }]
            },
            tooltips: {
              titleFontFamily: 'Roboto',
              titleFontStyle: 'normal',
              bodyFontFamily: 'Roboto',
              bodyFontStyle: '300',
              bodySpacing: 10,
              xPadding: 20,
              mode: 'label',
              backgroundColor: 'rgba(0, 0, 0, .6)',
              callbacks: {
                label: function (tooltipItem, data) {
                  var label = "";
                  if (tooltipItem.datasetIndex === 0) {
                    label = 'Reached lighthouse';
                  } else if (tooltipItem.datasetIndex === 1) {
                    label = 'Of which for the first time'
                  }
                  var label = label + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
                  return label;
                }
              }
            }
          }

          $scope.optionsWeapons = {
            responsive: true,
            legend: {
              position: 'bottom',
              fullWidth: false
            },
            tooltips: {
              bodyFontFamily: 'Roboto',
              bodyFontStyle: '300',
              xPadding: 20,
              mode: 'label',
              backgroundColor: 'rgba(0, 0, 0, .6)',
              callbacks: {
                label: function (tooltipItem, data) {
                  var label = data.labels[tooltipItem.index] + ' kills : ' + data.datasets[0].data[tooltipItem.index].toLocaleString();
                  return label;
                }
              }
            }
          }

      $scope.datasetsWeapons = {
                  label: 'Kills',
                  backgroundColor: [
                      '#D6D4D0',
                      '#695583',
                      '#7BA884'
                  ],
                  borderColor: [
                      '#D6D4D0',
                      '#695583',
                      '#7BA884'
                  ],
                  borderWidth: 1
              };

       $scope.labelsWeapons = ["Primary", "Heavy", "Secondary"];

       $scope.dataWeapons = [682740953, 117361134, 733896091];

  }

})();
