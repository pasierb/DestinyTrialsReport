'use strict';

var app = angular.module('trialsReportApp');

app.service('api', [
  '$http',
  'util',

  function ($http, util) {
    return new function () {
      var BASE_URL = '//api.destinytrialsreport.com/';
      var ENDPOINTS = {
        player: 'player/{membershipId}',
        supporterStatus: 'supporterStatus/{membershipId}',
        charitySupporter: 'charitySupporter/{membershipId}',
        lighthouseCount: 'lighthouseCount/{membershipIdArray}',
        opponents: 'getOpponents/{membershipId}',
        streak: 'longestStreak/{membershipId}/{characterId}',
        topWeapons: 'topWeapons/{membershipId}',
        lastWeapons: 'lastWeapons/{characterId}',
        weaponStats: 'weaponStats/{membershipId}/{weaponIdArray}',
        recentTeammates: 'recentTeammates/{membershipId}',
        previousMatches: 'previousMatches/{membershipId}',
        lighthouseLeaderboard: 'lighthouseLeaderboard',
        mapInfo: 'maps/week/{week}',
        currentMap: 'currentMap',
        currentWeek: 'currentWeek/{membershipId}',
        searchByName: 'searchByName/{membershipType}/{displayName}',
        getRandomAd: 'getRandomAd',
        playerAds: 'playerAds/{membershipIds}',
        challengeWeapons: 'trials/thisMap/{membershipId}',
        searchName: 'search/name/{name}/{membershipType}'
      };

      this.challengeWeapons = function(membershipId) {
        return this.get(ENDPOINTS.challengeWeapons, {
          membershipId: membershipId
        });
      };

      this.searchByName = function(membershipType, displayName) {
        var name = displayName.replace(/[^\w\s\-]/g, '');
        return this.get(ENDPOINTS.searchByName, {
          membershipType: membershipType,
          displayName: name
        });
      };

      this.searchName = function(name, membershipType) {
        name = name.replace(/[^\w\s\-]/g, '');
        return this.get(ENDPOINTS.searchName, {
          name: name,
          membershipType: membershipType
        });
      };

      this.getPlayer = function(membershipId) {
        return this.get(ENDPOINTS.player, {
          membershipId: membershipId
        });
      };

      this.checkSupporterStatus = function(membershipId) {
        return this.get(ENDPOINTS.supporterStatus, {
          membershipId: membershipId
        });
      };

      this.checkCharitySupporter = function(membershipId) {
        return this.get(ENDPOINTS.charitySupporter, {
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

      this.getMapInfo = function(week) {
        return this.get(ENDPOINTS.mapInfo, {
          week: week
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

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
