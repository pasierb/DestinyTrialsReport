'use strict';

var app = angular.module('trialsReportApp');

app.service('destinyTRN', [
  '$http',
  'util',

  function ($http, util) {
    return new function () {
      var BASE_URL = 'http://api.insights.destinytracker.com/api/';
      var ENDPOINTS = {
        getMMR: 'mmr/{platform}/{membershipId}/14'
      };

      this.getMMR = function(platform, membershipId) {
        return this.get(ENDPOINTS.getMMR, {
          platform: platform,
          membershipId: membershipId
        });
      };

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
