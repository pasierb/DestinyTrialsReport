'use strict';

angular
  .module('trialsReportApp')
  .config(window.$QDecorator)
  //.factory('httpResponseErrorInterceptor', ['$injector', '$q', '$timeout','$location', function($injector, $q, $timeout, $location) {
  //  return {
  //    'response': function (response) {
  //      if (response && response.data && response.data.ErrorStatus == 'PerEndpointRequestThrottleExceeded') {
  //        //toastr.error('We are currently under more traffic than the Bungie API will allow. Try again in a few minutes while we work on a solution', 'Error');
  //        //console.log('PerEndpointRequestThrottleExceeded, retrying');
  //        //return $timeout(function() {
  //        //  var $http = $injector.get('$http');
  //        //  return $http(response.config);
  //        //}, 5000);
  //        $location.path('/');
  //        return $q.reject(response);
  //      } else {
  //        return response;
  //      }
  //    }
  //  };
  //}])
  //.config(function($httpProvider) {
  //  $httpProvider.interceptors.push('httpResponseErrorInterceptor');
  //})
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
    })
  }])
  .config(['$translateProvider', '$localStorageProvider',
    function ($translateProvider, $localStorageProvider) {
      $translateProvider
      .fallbackLanguage('en')
      .useSanitizeValueStrategy('sanitize')
      .useStaticFilesLoader({
        prefix: 'shared/locales/',
        suffix: '/translations.json'
      });

      if ($localStorageProvider.get('language')) {
        $translateProvider
        .preferredLanguage($localStorageProvider.get('language'));
      } else {
        $translateProvider
        .registerAvailableLanguageKeys(['en', 'fr', 'es', 'de', 'it', 'ja', 'pt-br'], {
          'en_*': 'en',
          'fr_*': 'fr',
          'es_*': 'es',
          'de_*': 'de',
          'it_*': 'it',
          'ja_*': 'ja',
          'pt_*': 'pt-br'
        })
        .determinePreferredLanguage();
      }
  }])
  .run(function ($rootScope, $window) {
    // delete all the google related variables before you change the url
    $rootScope.$on('$locationChangeStart', function () {
      Object.keys($window).filter(function(k) { return k.indexOf('google') >= 0 }).forEach(
        function(key) {
          delete($window[key]);
        }
      );
    });
  });
