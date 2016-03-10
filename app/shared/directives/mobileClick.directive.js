'use strict';

angular.module('trialsReportApp')
  .directive('ngMobileClick', [function () {
    return function (scope, element, attributes) {
      element.bind('touchstart click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        scope.$apply(attributes['ngMobileClick']);
      });
    };
  }])
  .directive('basicClick', function($parse) {
    return {
      compile: function(elem, attr) {
        var fn = $parse(attr.basicClick);
        return function(scope, elem) {
          elem.on('click', function(e) {
            fn(scope, {$event: e});
            scope.$apply();
          });
        };
      }
    };
  })
  .directive('highlighter', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        model: '=highlighter'
      },
      link: function(scope, element) {
        scope.$watch('model', function (nv, ov) {
          if (nv !== ov) {
            // apply class
            element.addClass('highlight-change');

            // auto remove after some delay
            $timeout(function () {
              element.addClass('highlight-fade');
            }, 5000);

            $timeout(function () {
              element.removeClass('highlight-change');
              element.removeClass('highlight-fade');
            }, 25000);
          }
        });
      }
    };
  }]);
