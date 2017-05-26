'use strict';

var app = angular.module('trialsReportApp');

app.service('api', [
  '$http',
  'util',

  function ($http, util) {
    return new function () {
      var BASE_URL = '//api.destinytrialsreport.com/';
      var ENDPOINTS = {
        player:           'player/{membershipId}',
        opponents:        'getOpponents/{membershipId}',
        topWeapons:       'topWeapons/{membershipId}',
        lastWeapons:      'lastWeapons/{characterId}',
        weaponStats:      'weaponStats/{membershipId}/{weaponIdArray}',
        recentTeammates:  'recentTeammates/{membershipId}',
        previousMatches:  'previousMatches/{membershipId}',
        mapInfo:          'maps/week/{week}',
        currentMap:       'currentMap',
        currentWeek:      'currentWeek/{membershipId}',
        previousWeek:     'previousWeek/{membershipId}',
        challengeWeapons: 'trials/thisMap/{membershipId}',
        searchName:       'search/name/{name}/{membershipType}',
        weaponPercentage: 'leaderboard/percentage/{week}'
      };

      this.challengeWeapons = function(membershipId) {
        return this.get(ENDPOINTS.challengeWeapons, {
          membershipId: membershipId
        });
      };

      this.weaponPercentage = function(week) {
        return this.get(ENDPOINTS.weaponPercentage, {
          week: week
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

      this.getOpponents = function(membershipId) {
        return this.get(ENDPOINTS.opponents, {
          membershipId: membershipId
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

      this.previousWeek = function(membershipId) {
        return this.get(ENDPOINTS.previousWeek, {
          membershipId: membershipId
        });
      };

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
