(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .factory('realtimeContentFactory', function () {

      var locationActivities = [
        'Camping',
        'Dancing',
        'Hardscoping',
        'Crouching',
        'Running',
        'Hiding',
        'Fleeing',
        'Eating',
        'Cursing',
        'Walking',
        'Sniping',
        'Dying',
        'Planning'
      ];

      var locationPlaces = [
        'Top Blue',
        'Top Mid',
        'Elbow',
        'BR Tower',
        'Snipe 3'
      ];

      var thoughts = [
        'I should make pizza tonight',
        'Halo 2 is a much better game than this',
        'I don\'t feel like dancing',
        'Please please please let me go flawless',
        'Lorem ipsum dolor sit amet',
        'Dance to the music'
      ];

      var getRandomItemOf = function (array) {
        return array[Math.floor(Math.random() * array.length)]
      }

      var getNewHtml = function (type, inventory) {
        if (type === 'location') {
          return getRandomItemOf(locationActivities) + ' at ' + getRandomItemOf(locationPlaces);
        } else if (type === 'thought') {
          return '"' + getRandomItemOf(thoughts) + '"';
        } else if (type === 'elo') {
          return (Math.round(Math.random() * 1500) + 800).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else if (type === 'weapon' && inventory !== undefined) {

          var random = Math.round(Math.random() * 100),
              index = 0;

          if (random > 33 && random <= 66) {
            index = 1;
          } else if (random > 66) {
            index = 2;
          }

          return `
            <img class="last-match-weapon__img img-responsive" alt="${inventory[index].definition.name}" src="${inventory[index].definition.icon}">
            ${inventory[index].definition.name}
            `;
        }
      }

      return {
        getNewHtml: getNewHtml
      }
    })
    .directive('realtime', ['$timeout', 'realtimeContentFactory', function($timeout, realtimeContentFactory) {
      return {
        restrict: 'A',
        scope: {
          contentType: '@type',
          inventory: '='
        },
        link: function ($scope, elem) {
          $scope.update = function () {

            var oldHtml = elem.html();
            var newHtml = realtimeContentFactory.getNewHtml($scope.contentType, $scope.inventory);

            if (oldHtml !== newHtml) {
              elem.addClass('transitioning');
              $timeout(function () {
                elem.html(newHtml);
                elem.removeClass('transitioning');
              }, 200);
            }

            $timeout(function () {
              $scope.update();
            }, Math.round(Math.random() * 5000) + 3000);
          };

          $scope.update();
        }
      }
    }]);
}());
