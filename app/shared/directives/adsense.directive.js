(function () {

  'use strict';

  angular.module('trialsReportApp').

    service('Adsense', [function(){
      this.url = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      this.isAlreadyLoaded = false;
    }]).

    directive('adsense', function () {
      return {
        restrict: 'E',
        replace: true,
        scope : {
          adClient : '@',
          adSlot : '@',
          inlineStyle : '@',
          formatAuto : '@'
        },
        template: '<div class="ads"><ins class="adsbygoogle" data-ad-client="{{adClient}}" data-ad-slot="{{adSlot}}" style="{{inlineStyle}}" data-ad-format="{{formatAuto ? \'auto\' : \'\' }}"></ins></div>',
        controller: ['Adsense', '$timeout', function (Adsense, $timeout) {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = Adsense.url;
          s.async = true;
          document.body.appendChild(s);
          /**
           * We need to wrap the call the AdSense in a $apply to update the bindings.
           * Otherwise, we get a 400 error because AdSense gets literal strings from the directive
           */
          setTimeout(function() { (window.adsbygoogle = window.adsbygoogle || []).push({}); }, 750);
          //$timeout(function(){
          //  (window.adsbygoogle = window.adsbygoogle || []).push({});
          //});
        }]
      };
    });
}());
