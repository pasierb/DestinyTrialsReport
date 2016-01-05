'use strict';

angular.module('trialsReportApp')
  .directive('adsense', function() {
    return {
      restrict: 'A',
      replace: true,
      template: [
        '<ins class="adsbygoogle"' +
             'style="display:block"' +
             'data-ad-client="ca-pub-5549262666967585"' +
             'data-ad-slot="7148544984"' +
             'data-ad-format="auto">' +
        '</ins>'
      ].join(''),
      controller: function () {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
});
