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
  .config(['$translateProvider', '$localStorageProvider', function ($translateProvider, $localStorageProvider) {
    $translateProvider
      .translations('en', {
        LANGUAGE: 'Language',
        ENGLISH: 'English',
        SPANISH: 'Spanish',
        GERMAN: 'German',
        FRENCH: 'French',
        JAPANESE: 'Japanese'
      })
      .translations('es', {
        LANGUAGE: 'Idioma',
        ENGLISH: 'Inglés',
        SPANISH: 'Español',
        GERMAN: 'Alemán',
        FRENCH: 'Francés',
        JAPANESE: 'Japonés'
      })
      .translations('de', {
        LANGUAGE: 'Sprache',
        ENGLISH: 'Englisch',
        SPANISH: 'Spanisch',
        GERMAN: 'Deutsche',
        FRENCH: 'Französisch',
        JAPANESE: 'Japanisch'
      })
      .translations('fr', {
        LANGUAGE: 'Langue',
        ENGLISH: 'Anglais',
        SPANISH: 'Espanol',
        GERMAN: 'Allemand',
        FRENCH: 'Français',
        JAPANESE: 'Japonais'
      })
      .translations('ja', {
        LANGUAGE: '言語',
        ENGLISH: '英語',
        SPANISH: 'スペイン語',
        GERMAN: 'ドイツ人',
        FRENCH: 'フランス語',
        JAPANESE: '日本語'
      })
      .preferredLanguage($localStorageProvider.get('language') || 'en')
      .fallbackLanguage('en');
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
