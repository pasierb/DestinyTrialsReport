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
        JAPANESE: 'Japanese',
        PORTUGUESE: 'Portuguese',
        INTELLECT: 'Intellect',
        DISCIPLINE: 'Discipline',
        STRENGTH: 'Strength',
        ARMOR: 'Armor',
        RECOVERY: 'Recovery',
        AGILITY: 'Agility'
      })
      .translations('es', {
        LANGUAGE: 'Idioma',
        ENGLISH: 'Inglés',
        SPANISH: 'Español',
        GERMAN: 'Alemán',
        FRENCH: 'Francés',
        JAPANESE: 'Japonés',
        PORTUGUESE: 'Portugués',
        INTELLECT: 'Intelecto',
        DISCIPLINE: 'Disciplina',
        STRENGTH: 'Fuerza',
        ARMOR: 'Armadura',
        RECOVERY: 'Recuperación',
        AGILITY: 'Agilidad'
      })
      .translations('de', {
        LANGUAGE: 'Sprache',
        ENGLISH: 'Englisch',
        SPANISH: 'Spanisch',
        GERMAN: 'Deutsche',
        FRENCH: 'Französisch',
        JAPANESE: 'Japanisch',
        PORTUGUESE: 'Portugiesisch',
        INTELLECT: 'Intellekt',
        DISCIPLINE: 'Disziplin',
        STRENGTH: 'Stärke',
        ARMOR: 'Rüstung',
        RECOVERY: 'Erholung',
        AGILITY: 'Agilität'
      })
      .translations('fr', {
        LANGUAGE: 'Langue',
        ENGLISH: 'Anglais',
        SPANISH: 'Espanol',
        GERMAN: 'Allemand',
        FRENCH: 'Français',
        JAPANESE: 'Japonais',
        PORTUGUESE: 'Portugais',
        INTELLECT: 'Intelligence',
        DISCIPLINE: 'Discipline',
        STRENGTH: 'Force',
        ARMOR: 'Armure',
        RECOVERY: 'Régénération',
        AGILITY: 'Agilité'
      })
      .translations('ja', {
        LANGUAGE: '言語',
        ENGLISH: '英語',
        SPANISH: 'スペイン語',
        GERMAN: 'ドイツ人',
        FRENCH: 'フランス語',
        JAPANESE: '日本語',
        PORTUGUESE: 'ポルトガル語',
        INTELLECT: '知性',
        DISCIPLINE: '鍛錬',
        STRENGTH: '敏捷性',
        ARMOR: '生命力',
        RECOVERY: '回復',
        AGILITY: '敏捷性'
      })
      .translations('pt-br', {
        LANGUAGE: 'Língua',
        ENGLISH: 'Inglês',
        SPANISH: 'Espanhol',
        GERMAN: 'Alemão',
        FRENCH: 'Francês',
        JAPANESE: 'Japonês',
        PORTUGUESE: 'Português',
        INTELLECT: 'Intelecto',
        DISCIPLINE: 'Disciplina',
        STRENGTH: 'Força',
        ARMOR: 'Armadura',
        RECOVERY: 'Recuperação',
        AGILITY: 'Agilidade'
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
