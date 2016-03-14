'use strict';

var app = angular.module('trialsReportApp');

app.service('bungie', [
  '$http',
  'util',
  'RequestFallback',

  function ($http, util, RequestFallback) {
    return new function () {
      //var BASE_URL = 'https://proxys.destinytrialsreport.com/Platform/Destiny/';
      var ENDPOINTS = {
        searchForPlayer: 'SearchDestinyPlayer/{platform}/{name}/',
        account: '{platform}/Account/{membershipId}/',
        grimoire: 'Vanguard/Grimoire/{platform}/{membershipId}/?single={cardId}',
        stats: 'Stats/{platform}/{membershipId}/{characterId}/?modes={mode}',
        inventory: '{platform}/Account/{membershipId}/Character/{characterId}/Inventory/',
        activityHistory: 'Stats/ActivityHistory/{platform}/{membershipId}/{characterId}/?mode={mode}&count={count}',
        pgcr: 'Stats/PostGameCarnageReport/{instanceId}/'
      };
      this.searchForPlayer = function(platform, name) {
        return this.get(ENDPOINTS.searchForPlayer, {
          platform: platform,
          name: name.replace(/[^\w\s\-]/g, '')
        });
      };

      this.getPgcr = function(instanceId) {
        return this.get(ENDPOINTS.pgcr, {
          instanceId: instanceId
        });
      };

      this.getAccount = function(platform, membershipId) {
        return this.get(ENDPOINTS.account, {
          platform: platform,
          membershipId: membershipId
        });
      };

      this.getGrimoire = function(platform, membershipId, cardId) {
        return this.get(ENDPOINTS.grimoire, {
          platform: platform,
          membershipId: membershipId,
          cardId: cardId
        });
      };

      this.getActivityHistory = function(platform, membershipId, characterId, mode, count) {
        return this.get(ENDPOINTS.activityHistory, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          mode: mode,
          count: count
        });
      };

      this.getStats = function(platform, membershipId, characterId, mode) {
        return this.get(ENDPOINTS.stats, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          mode: mode
        });
      };

      this.getInventory = function(platform, membershipId, characterId) {
        return this.get(ENDPOINTS.inventory, {
          platform: platform,
          membershipId: membershipId,
          characterId: characterId,
          locale: 'en'
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
