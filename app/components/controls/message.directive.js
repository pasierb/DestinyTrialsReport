(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .directive('message', message);

  function message() {
    return {
      restrict: 'A',
      scope: {
        message: '=message',
        messageType: '=messageType',
        messageId: '=messageId'
      },
      link: function ($scope) {
        $scope.isHidden = sessionStorage.getItem('hideMessage' + $scope.messageId);

        $scope.hideMessage = function () {
          sessionStorage.setItem('hideMessage' + $scope.messageId, true);
          $scope.isHidden = true;
        };
      },
      templateUrl: 'components/controls/message.template.html'
    };
  };
}());
