'use strict';

angular
  .module('trialsReportApp')
  .config(function ($routeProvider, $httpProvider, $compileProvider, $locationProvider) {
    $.material.init();

      $routeProvider
      .when('/', {
        templateUrl: 'components/home/home.html',
        controller: 'homeController',
        resolve: {
          config: gggWeapons
        }
      })
      .when('/:platformName/:playerName', {
        templateUrl: 'components/home/home.html',
        controller: 'homeController',
        resolve: {
          config: getFromParams
        }
      })
      .when('/:platformName/:playerName/:instanceId', {
        templateUrl: 'components/home/home.html',
        controller: 'homeController',
        resolve: {
          config: getFromParams
        }
      })
      .when('/:platformName/:playerOne/:playerTwo/:playerThree', {
        templateUrl: 'components/home/home.html',
        controller: 'homeController',
        resolve: {
          config: getFromParams
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);
  });
