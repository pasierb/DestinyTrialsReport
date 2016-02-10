'use strict';

angular.module('trialsReportApp')
  .directive('caroussel', ['$customSwipe', function($customSwipe) {
    return {
      restrict: 'A',
      link: function(scope, ele) {
        var startX;
        var startTransformX;
        var container = $('.players').first();
        var active = false;
        var activePlayer = scope.$parent.focusOnPlayer;
        $customSwipe.bind(ele, {
          start: function (coords) {
            if (window.innerWidth <= 960) {
              container = $('.players').first();
              activePlayer = scope.$parent.focusOnPlayer;
              active = true;
              container.css('transition', 'none');
              container.css('-webkit-transition', 'none');
              startX = coords.x;
              startTransformX = parseFloat(container.css('transform').split(',')[4]);
              if (isNaN(startTransformX)) {
                startTransformX = 0;
              }
            }
          },
          move: function(coords) {
            if (active) {
              var delta = coords.x - startX;
              container.css('transform', 'translate3d(' + (startTransformX + (delta / 2)) + 'px, 0px, 0px)');
              container.css('-webkit-transform', 'translate3d(' + (startTransformX + (delta / 2)) + 'px, 0px, 0px)');
              container.css('-ms-transform', 'translate3d(' + (startTransformX + (delta / 2)) + 'px, 0px, 0px)');
            }
          },
          end: function(coords) {
            var delta = coords.x - startX;
            container.removeAttr('style');
            if (delta < -10) {
              if (activePlayer === 1) {
                if (window.innerWidth > 640) {
                  $('.players-wrapper').removeClass('focus-on-player-one').addClass('focus-on-player-three');
                  scope.$parent.focusOnPlayer = 3;
                } else {
                  $('.players-wrapper').removeClass('focus-on-player-one').addClass('focus-on-player-two');
                  scope.$parent.focusOnPlayer = 2;
                }
              }
            } else if (delta > 10) {
              if (activePlayer === 2) {
                $('.players-wrapper').removeClass('focus-on-player-two').addClass('focus-on-player-one');
                scope.$parent.focusOnPlayer = 1;
              }
            }
            active = false;
          }
        }, 0);
      }
    };
  }]);
