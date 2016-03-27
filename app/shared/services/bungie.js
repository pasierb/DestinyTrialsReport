'use strict';

var app = angular.module('trialsReportApp');

app.service('bungie', [
  '$http',
  'util',
  'RequestFallback',
  '$localStorage',

  function ($http, util, RequestFallback, $localStorage) {
    return new function () {
      //var BASE_URL = 'https://proxys.destinytrialsreport.com/Platform/Destiny/';
      var ENDPOINTS = {
        searchForPlayer: 'SearchDestinyPlayer/{platform}/{name}/?lc={locale}',
        account: '{platform}/Account/{membershipId}/?lc={locale}',
        grimoire: 'Vanguard/Grimoire/{platform}/{membershipId}/?single={cardId}&lc={locale}',
        stats: 'Stats/{platform}/{membershipId}/{characterId}/?modes={mode}&lc={locale}',
        inventory: '{platform}/Account/{membershipId}/Character/{characterId}/Inventory/?lc={locale}',
        activityHistory: 'Stats/ActivityHistory/{platform}/{membershipId}/{characterId}/?mode={mode}&count={count}&lc={locale}',
        pgcr: 'Stats/PostGameCarnageReport/{instanceId}/?lc={locale}'
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
        var rand = _.random(13, 26);
        var BASE_URL = '//trials-api' + rand + '.herokuapp.com/Platform/Destiny/';
        return RequestFallback(BASE_URL, endpoint, tokens);
        //return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
      };
    };
  }
]);
