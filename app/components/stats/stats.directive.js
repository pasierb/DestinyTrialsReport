'use strict';

angular.module('trialsReportApp')
  .directive('trialsHistory', function() {
    return {
      restrict: 'A',
      scope: {
        activities: '=trialsHistory',
        kd: '=playerKd'
      },
      link: function ($scope) {
        var kd = $scope.kd;
        var factor = -60,
            range = 1.5,
            unit = '%';

        $scope.calcGraphPoint = function (matchKd) {
          var x = 0;
          if (matchKd < kd) {
            x = Math.max(-range, matchKd - kd);
          } else {
            x = Math.min(range, matchKd - kd);
          }
          var value = x * factor + unit;
          var translateY = 'translateY(' + value + '); ';
          var style = '';
          angular.forEach(['transform: ', '-webkit-transform: ', '-ms-transform: '], function(key) {
            style += key + translateY;
          });
          return style;
        };
      },
      templateUrl: 'components/stats/stats.template.html'
    };
  }).directive('buildStats', function() {
    return {
      restrict: 'A',
      scope: {
        stats: '=buildStats'
      },
      templateUrl: 'components/stats/build.template.html'
    };
  });
