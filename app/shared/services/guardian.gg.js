'use strict';

var app = angular.module('trialsReportApp');

app.service('guardianGG', [
  '$http',
  'util',

  function ($http, util) {
    return new function () {
      var BASE_URL = 'https://api.guardian.gg/';
      var ENDPOINTS = {
        getElo: 'elo/{membershipId}',
        getMap: 'dtr/trials-map',
        getTeamElo: 'dtr/elo?alpha={teamArray}',
        getFireteam: 'fireteam/{mode}/{membershipId}',
        getTeam: 'dtr/{membershipIdArray}',
        getWeapons: 'weapon/top?platform={platform}&mode=14&start={start}&end={end}'
      };

      this.getElo = function(membershipId) {
        return this.get(ENDPOINTS.getElo, {
          membershipId: membershipId
        });
      };

      this.getMap = function() {
        return this.get(ENDPOINTS.getMap, {});
      };

      this.getTeamElo = function(teamArray) {
        return this.get(ENDPOINTS.getTeamElo, {
          teamArray: teamArray
        });
      };

      this.getFireteam = function(mode, membershipId) {
        return this.get(ENDPOINTS.getFireteam, {
          mode: mode,
          membershipId: membershipId
        });
      };

      this.getTeam = function(membershipIdArray) {
        return this.get(ENDPOINTS.getTeam, {
          membershipIdArray: membershipIdArray
        });
      };

      this.getWeapons = function(platform, start, end) {
        return this.get(ENDPOINTS.getWeapons, {
          platform: platform,
          start: start,
          end: end
        });
      };

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
