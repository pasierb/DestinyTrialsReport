'use strict';

angular.module('trialsReportApp')
  .directive('adsense', function() {
    return {
      restrict: 'A',
      replace: true,
      template: [
        '<ins class="adsbygoogle"' +
             'style="display:block"' +
             'data-ad-client="ca-pub-7408805581120581"' +
             'data-ad-slot="1127916954"' +
             'data-ad-format="auto">' +
        '</ins>'
      ].join(''),
      controller: function () {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  })
  .directive('adsenseSmall', function() {
    return {
      restrict: 'A',
      replace: true,
      template: [
        '<ins class="adsbygoogle"' +
        'style="display:inline-block;width:320px;height:50px"' +
        'data-ad-client="ca-pub-7408805581120581"' +
        'data-ad-slot="7815945353">' +
        '</ins>'
      ].join(''),
      controller: function () {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  });
