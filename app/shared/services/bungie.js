'use strict';

var app = angular.module('trialsReportApp');

app.service('bungie', [
  '$http',
  '$location',
  'util',
  '$localStorage',

  function ($http, $location, util, $localStorage) {
    return new function () {
      var HEADERS = {
        headers: {'X-API-KEY': util.getApiKey($location.host())}
      };
      var BASE_URL = 'https://www.bungie.net/Platform/';
      var ENDPOINTS = {
        searchForPlayer: 'Destiny/SearchDestinyPlayer/{platform}/{name}/?lc={locale}',
        account: 'Destiny/{platform}/Account/{membershipId}/?lc={locale}',
        grimoire: 'Destiny/Vanguard/Grimoire/{platform}/{membershipId}/?single={cardId}&lc={locale}',
        stats: 'Destiny/Stats/{platform}/{membershipId}/{characterId}/?modes={mode}&lc={locale}',
        inventory: 'Destiny/{platform}/Account/{membershipId}/Character/{characterId}/Inventory/?lc={locale}',
        activityHistory: 'Destiny/Stats/ActivityHistory/{platform}/{membershipId}/{characterId}/?mode={mode}&count={count}&lc={locale}',
        pgcr: 'Destiny/Stats/PostGameCarnageReport/{instanceId}/?lc={locale}',
        partnership: 'User/{bnetId}/Partnerships/'
      };

      this.searchForPlayer = function(platform, name) {
        return this.get(ENDPOINTS.searchForPlayer, {
          platform: platform,
          name: name.replace(/[^\w\s\-]/g, ''),
          locale: $localStorage.language
        });
      };

      this.getPgcr = function(instanceId) {
        return this.get(ENDPOINTS.pgcr, {
          instanceId: instanceId,
          locale: $localStorage.language
        });
      };

      this.getPartnership = function(bnetId) {
        return this.get(ENDPOINTS.partnership, {
          bnetId: bnetId
        });
      };

      this.getAccount = function(platform, membershipId) {
        return this.get(ENDPOINTS.account, {
          platform: platform,
          membershipId: membershipId,
          locale: $localStorage.language
        });
      };

      this.getGrimoire = function(platform, membershipId, cardId) {
        return this.get(ENDPOINTS.grimoire, {
          platform: platform,
          membershipId: membershipId,
          cardId: cardId,
          locale: $localStorage.language
        });
      };

      this.getActivityHistory = function(platform, membershipId, characterId, mode, count) {
        return this.get(ENDPOINTS.activityHistory, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          mode: mode,
          count: count,
          locale: $localStorage.language
        });
      };

      this.getStats = function(platform, membershipId, characterId, mode) {
        return this.get(ENDPOINTS.stats, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          mode: mode,
          locale: $localStorage.language
        });
      };

      this.getInventory = function(platform, membershipId, characterId) {
        return this.get(ENDPOINTS.inventory, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          locale: $localStorage.language
        });
      };

      this.get = function(endpoint, tokens) {
        return $http.get(BASE_URL + util.buildUrl(endpoint, tokens), HEADERS);
      };
    };
  }
]);
