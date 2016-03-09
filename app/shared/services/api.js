'use strict';

var app = angular.module('trialsReportApp');

app.service('api', [
  '$http',
  'util',
  'RequestFallback',

  function ($http, util, RequestFallback) {
    return new function () {
      var BASE_URL = '//api.trials.report/';
      var ENDPOINTS = {
        supporterStatus: 'supporterStatus/{membershipId}',
        lighthouseCount: 'lighthouseCount/{membershipIdArray}',
        opponents: 'getOpponents/{membershipId}',
        streak: 'longestStreak/{membershipId}/{characterId}',
        topWeapons: 'topWeapons/{membershipId}',
        lastWeapons: 'lastWeapons/{characterId}',
        weaponStats: 'weaponStats/{membershipId}/{weaponIdArray}',
        recentTeammates: 'recentTeammates/{membershipId}',
        previousMatches: 'previousMatches/{membershipId}',
        lighthouseLeaderboard: 'lighthouseLeaderboard',
        mapInfo: 'mapInfo/{referenceId}',
        currentMap: 'currentMap',
        currentWeek: 'currentWeek/{membershipId}',
        searchByName: 'searchByName/{membershipType}/{displayName}',
        getRandomAd: 'getRandomAd',
        playerAds: 'playerAds/{membershipIds}'
      };

      var FALLBACK = {
        searchByName: 'https://proxy.trials.report/Platform/Destiny/SearchDestinyPlayer/{membershipType}/{displayName}/'
      };

      this.searchByName = function(membershipType, displayName) {
        var name = displayName.replace(/[^\w\s\-]/g, '');
        return this.get(ENDPOINTS.searchByName, {
          membershipType: membershipType,
          displayName: name
        }, FALLBACK.searchByName + membershipType + '/' + name);
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

      this.lastWeapons = function(characterId) {
        return this.get(ENDPOINTS.lastWeapons, {
          characterId: characterId
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

      this.getMapInfo = function(referenceId) {
        return this.get(ENDPOINTS.mapInfo, {
          referenceId: referenceId
        });
      };

      this.getCurrentMap = function() {
        return this.get(ENDPOINTS.currentMap, {});
      };

      this.currentWeek = function(membershipId) {
        return this.get(ENDPOINTS.currentWeek, {
          membershipId: membershipId
        });
      };

      this.playerAds = function(membershipIds) {
        return this.get(ENDPOINTS.playerAds, {
          membershipIds: membershipIds
        });
      };

      this.getRandomAd = function() {
        return this.get(ENDPOINTS.getRandomAd, {});
      };

      this.get = function(endpoint, tokens, fallback) {
        return RequestFallback(BASE_URL, endpoint, tokens, fallback);
      }
    };
  }
]);
