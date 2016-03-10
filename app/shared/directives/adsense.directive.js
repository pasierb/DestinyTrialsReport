(function () {

  'use strict';

  var ngAdSense = angular.module('trialsReportApp');
  ngAdSense.constant('SCRIPT_URL', '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');

  ngAdSense.service('AdsenseTracker', [function () {
    this.isLoaded = false;
  }]);

  ngAdSense.controller('AdsenseController', ["SCRIPT_URL", "AdsenseTracker", "$timeout", function (SCRIPT_URL, AdsenseTracker, $timeout) {

    //if (!AdsenseTracker.isLoaded) {
    //  var s = document.createElement('script');
    //  s.src = SCRIPT_URL;
    //  document.body.appendChild(s);
    //  AdsenseTracker.isLoaded = true;
    //}
    //$timeout(function () {
    //  try {
    //    (window.adsbygoogle = window.adsbygoogle || []).push({});
    //  } catch (ex) {
    //  }
    //}, 750);
  }]);

  ngAdSense.directive('adsense', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        adClient: '@',
        adSlot: '@',
        inlineStyle: '@',
        formatAuto: '@'
      },
      template: '<div class="ads"><ins class="adsbygoogle" data-ad-client="{{adClient}}" data-ad-slot="{{adSlot}}" style="{{inlineStyle}}" data-ad-format="{{formatAuto ? \'auto\' : \'\' }}"></ins></div>',
      controller: 'AdsenseController'
    };
  });
}());
