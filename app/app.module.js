'use strict';

function getSubdomain() {
  var segments = location.hostname.split('.');
  return segments.length > 2 ? segments[segments.length - 3].toLowerCase() : null;
}

function throwLog(msg) {
  var logsOn = false;
  if (logsOn) {
    console.log(msg);
  }
}

function getFromParams(homeFactory, inventoryService, $localStorage, guardianggFactory, api, toastr, bungie, $route, $q) {
  var params = $route.current.params;
  var name = params.playerName || params.playerOne;
  if (angular.isDefined(name)) {
    var platform = params.platformName === 'xbox' ? 1 : 2;
    var subdomain = getSubdomain();

    var getPlayer = function () {
      throwLog('getPlayer');
      return homeFactory.getAccount(platform, params.playerName)
        .then(function (result) {
          if (result) {
            var player = result;
            player.searched = true;
            if (subdomain === 'my' || subdomain === 'opponents') {
              return homeFactory.getCharacters(
                player.membershipType,
                player.membershipId,
                player.name
              );
            } else {
              return homeFactory.getRecentActivity(player)
                .then(function (resultBNG) {
                  if (resultBNG && resultBNG[0]) {
                    return homeFactory.getFireteam(resultBNG);
                  } else {
                    return guardianggFactory.getFireteam('14', player.membershipId)
                      .then(function (resultGGG) {
                        if (resultGGG && resultGGG.data.length > 0) {
                          resultGGG.data.membershipId = player.membershipId;
                          return resultGGG.data;
                        } else {
                          return player;
                        }
                      });
                  }
                });
            }
          } else {
            return false;
          }
        });
    };

    var teammatesFromParams = function () {
      throwLog('teammatesFromParams');
      var methods = [
        homeFactory.getAccount(platform, params.playerOne),
        homeFactory.getAccount(platform, params.playerTwo),
        homeFactory.getAccount(platform, params.playerThree)
      ];
      return $q.all(methods);
    };

    var teammatesFromChars = function (player) {
      throwLog('teammatesFromChars');
      if (player) {
        var methods = [];
        angular.forEach(player.characters, function (character) {
          methods.push(character);
        });
        return $q.all(methods);
      } else {
        return false;
      }
    };

    var teammatesFromRecent = function (players) {
      throwLog('teammatesFromRecent');
      if (players && players[0] && !players[0].characterInfo) {
        var playerOne = _.find(players, function (player) {
          return player.searched;
        });
        var methods = [homeFactory.getCharacters(
          playerOne.membershipType,
          playerOne.membershipId,
          playerOne.name
        )];
        angular.forEach(players, function (player) {
          if (angular.lowercase(player.name) !== angular.lowercase(name)) {
            methods.push(homeFactory.getCharacters(
              player.membershipType,
              player.membershipId,
              player.name
            ));
          }
        });
        return $q.all(methods);
      } else if (players && players.characterInfo) {
        return [players];
      } else {
        return false;
      }
    };

    var getInventory = function (players) {
      throwLog('getInventory');
      var methods = [];
      angular.forEach(players, function (player) {
        methods.push(inventoryService.getInventory(player.membershipType, player));
      });
      return $q.all(methods);
    };

    var getOpponents = function (player) {
      throwLog('getOpponents');
      return api.getOpponents(player.membershipId);
    };

    var returnPlayer = function (results) {
      throwLog('returnPlayer', results);
      if (results && (results.length > 0 || results.data)) {
        return {
          fireteam: [results[0], results[1], results[2]],
          subdomain: subdomain,
          updateUrl: params.playerName,
          data: results.data
        };
      } else {
        return gggWeapons($localStorage, guardianggFactory);
      }
    };

    var reportProblems = function (fault) {
      throwLog('reportProblems');
      console.log(fault);
    };

    if (!$route.current.params.preventLoad) {
      if (params.playerOne) {
        return teammatesFromParams()
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      } else if (subdomain === 'my') {
        return getPlayer()
          .then(teammatesFromChars)
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      } else if (subdomain === 'opponents') {
        return getPlayer()
          .then(getOpponents)
          .then(returnPlayer)
          .catch(reportProblems);
      } else {
        return getPlayer()
          .then(teammatesFromRecent)
          .then(getInventory)
          .then(returnPlayer)
          .catch(reportProblems);
      }
    }
  }
}

function getTrialsBeginDate(referenceDate) {
  var now = moment.utc(referenceDate);
  var hour = now.clone().tz('America/Los_Angeles').isDST() ? 17 : 18;
  var begin = now.clone().day(5).hour(hour).minute(0).second(0).millisecond(0);
  if (now.isBefore(begin)) {
    begin.subtract(1, 'week');
  }
  return begin;
}

function getTrialsDates() {
  var begin = getTrialsBeginDate();
  var end = begin.clone().add(4, 'days').hour(9);
  return {
    begin: begin,
    end: end
  };
}

var trialsDates = getTrialsDates();

function getRelativeWeekText(trialsBeginDate, trialsInProgress, showImmediately, period) {
  var weeksAgo = Math.round(trialsDates.begin.diff(trialsBeginDate, 'weeks', true));
  var text;
  if (weeksAgo === 0) {
    if (trialsInProgress && (showImmediately || period.isAfter(trialsDates.begin))) {
      text = 'this week';
    } else {
      text = 'last week';
    }
  } else if (weeksAgo === 1) {
    if (trialsInProgress) {
      text = 'last week';
    } else {
      text = '2 weeks ago';
    }
  } else {
    if (!trialsInProgress) weeksAgo++;
    text = weeksAgo + ' weeks ago';
  }
  return text;
}

var DestinyArmorDefinition;
var DestinyMedalDefinition;
var DestinySubclassDefinition;
var DestinyWeaponDefinition;
var DestinyCrucibleMapDefinition;
var DestinyTalentGridDefinition;
var DestinyStepsDefinition;

function getDefinitions($localStorage, $q, $http) {
  var language = 'en';
  if (['en', 'es', 'de', 'fr', 'it', 'pt-br', 'ja'].indexOf($localStorage.language) !== -1) {
    language = $localStorage.language;
  }
  return $q.all([
    $http.get('//api.destinytrialsreport.com/manifest/' + language + '/DestinyArmorDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/' + language + '/DestinyMedalDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/' + language + '/DestinySubclassDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/' + language + '/DestinyWeaponDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/' + language + '/DestinyCrucibleMapDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/v2/all/DestinyTalentGridDefinition.json', {cache:true}),
    $http.get('//api.destinytrialsreport.com/manifest/v2/' + language + '/DestinyStepsDefinition.json', {cache:true})
  ])
  .then(function (responses) {
    DestinyArmorDefinition       = responses[0].data;
    DestinyMedalDefinition       = responses[1].data;
    DestinySubclassDefinition    = responses[2].data;
    DestinyWeaponDefinition      = responses[3].data;
    DestinyCrucibleMapDefinition = responses[4].data;
    DestinyTalentGridDefinition  = responses[5].data;
    DestinyStepsDefinition       = responses[6].data;
  });
}

angular
  .module('trialsReportApp', [
    'angulartics',
    'angulartics.google.analytics',
    'angularUtils.directives.dirPagination',
    'angular-loading-bar',
    'chart.js',
    'mgcrea.ngStrap.modal',
    'mgcrea.ngStrap.popover',
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'toastr',
    'ui.bootstrap.tpls',
    'ui.bootstrap.progressbar',
    'ui.bootstrap.tabs',
    'ui.bootstrap.pagination'
  ]);
