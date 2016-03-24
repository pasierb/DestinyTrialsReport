'use strict';

angular
.module('trialsReportApp')
.config(function ($routeProvider, $httpProvider, $compileProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'components/home/home.html',
    controller: 'homeController',
    resolve: {
      config: gggWeapons,
      definitions: getDefinitions
    }
  })
  .when('/:platformName/:playerName', {
    templateUrl: 'components/home/home.html',
    controller: 'homeController',
    resolve: {
      config: getFromParams,
      definitions: getDefinitions
    }
  })
  .when('/:platformName/:playerName/:instanceId', {
    templateUrl: 'components/home/home.html',
    controller: 'homeController',
    resolve: {
      config: getFromParams,
      definitions: getDefinitions
    }
  })
  .when('/:platformName/:playerOne/:playerTwo/:playerThree', {
    templateUrl: 'components/home/home.html',
    controller: 'homeController',
    resolve: {
      config: getFromParams,
      definitions: getDefinitions
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
