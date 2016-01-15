'use strict';

var app = angular.module('trialsReportApp');

app.service('util', [

  function () {
    return new function () {
      var urlRegex = /{(\w+)}/;

      this.buildUrl = function (url, tokens) {
        var match;

        while (match = urlRegex.exec(url)) {
          if (null === tokens[match[1]]) {
            throw 'Missing "' + match[1] + '" for ' + url;
          }
          url = url.replace(match[0], tokens[match[1]]);
        }

        return url;
      };
    };
  }
]);
