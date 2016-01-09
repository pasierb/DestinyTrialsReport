'use strict';

var app = angular.module('trialsReportApp');

app.service('api', [
  '$http',
  'util',

  function ($http, util) {
    return new function () {
      var BASE_URL = 'http://api.destinytrialsreport.com/';
      var ENDPOINTS = {
        supporterStatus: 'supporterStatus/{membershipId}',
        lighthouseCount: 'lighthouseCount/{membershipIdArray}',
        opponents: 'getOpponents/{membershipId}',
        streak: 'longestStreak/{membershipId}/{characterId}',
        topWeapons: 'topWeapons/{membershipId}',
        weaponStats: 'weaponStats/{membershipId}/{weaponIdArray}',
        recentTeammates: 'recentTeammates/{membershipId}',
        previousMatches: 'previousMatches/{membershipId}',
        lighthouseLeaderboard: 'lighthouseLeaderboard'
      };

      this.checkSupporterStatus = function(membershipId) {
        return this.get(ENDPOINTS.supporterStatus, {
          membershipId: membershipId
        });
      };

      this.lighthouseCount = function(membershipIdArray) {
        return this.get(ENDPOINTS.lighthouseCount, {
          membershipIdArray: membershipIdArray
        });
      };

      this.getOpponents = function(membershipId) {
        return this.get(ENDPOINTS.opponents, {
          membershipId: membershipId
        });
      };

      this.longestStreak = function(membershipId, characterId) {
        return this.get(ENDPOINTS.streak, {
          membershipId: membershipId,
          characterId: characterId
        });
      };

      this.topWeapons = function(membershipId) {
        return this.get(ENDPOINTS.topWeapons, {
          membershipId: membershipId
        });
      };

      this.weaponStats = function(membershipId, weaponIdArray) {
        return this.get(ENDPOINTS.weaponStats, {
          membershipId: membershipId,
          weaponIdArray: weaponIdArray
        });
      };

      this.recentTeammates = function(membershipId) {
        return this.get(ENDPOINTS.recentTeammates, {
          membershipId: membershipId
        });
      };

      this.previousMatches = function(membershipId) {
        return this.get(ENDPOINTS.previousMatches, {
          membershipId: membershipId
        });
      };

      this.lighthouseLeaderboard = function() {
        return this.get(ENDPOINTS.lighthouseLeaderboard, {});
      };

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
