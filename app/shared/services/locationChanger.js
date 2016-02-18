'use strict';

var app = angular.module('trialsReportApp');

app.service('locationChanger', ['$location', '$route', '$rootScope', function ($location, $route, $rootScope) {
  this.skipReload = function () {
    var lastRoute = $route.current;
    $rootScope.$on('$locationChangeSuccess', function () {
      if (angular.isUndefined($route.current.params.playerName) ||
        angular.isDefined($route.current.params.instanceId)){
        lastRoute.params.preventLoad = true;
        $route.current = lastRoute;
      }
    });
    return this;
  };

  this.withoutRefresh = function (url, doesReplace) {
    if (doesReplace) {
      $location.path(url).replace();
    } else {
      $location.path(url || '/');
    }
  };
}]);
