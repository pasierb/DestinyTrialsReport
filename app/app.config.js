'use strict';

angular
  .module('trialsReportApp')
  .config(window.$QDecorator)
  .factory('httpResponseErrorInterceptor', ['$injector', '$q', '$timeout', function($injector, $q, $timeout) {
    return {
      'response': function (response) {
        if (response && response.data && response.data.ErrorStatus == 'PerEndpointRequestThrottleExceeded') {
          console.log('PerEndpointRequestThrottleExceeded, retrying');
          return $timeout(function() {
            var $http = $injector.get('$http');
            return $http(response.config);
          }, 1000);
          return $q.reject(response);
        } else {
          return response;
        }
      }
    };
  }])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('httpResponseErrorInterceptor');
  })
  .config(function ($modalProvider) {
    angular.extend($modalProvider.defaults, {
      container: 'body',
      placement: 'center'
    });
  })
  .config(function ($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
      animation: false,
      container: 'body',
      html: true,
      placement: 'top',
      trigger: 'hover'
    });
  })
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FFD700'],
      animaton: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      pointDot: false,
      showScale: false,
      pointHitDetectionRadius: 0,
      maintainAspectRatio: false,
      datasetFill: false,
      bezierCurveTension: .1,
      tooltipFontFamily: "'Roboto Condensed', sans-serif",
      tooltipTitleFontStyle: "300"
    });
  }])
