(function() {
  'use strict';

  angular
  .module('trialsReportApp')
  .component('dtrMessage', {
    bindings: {
      id: '@',
      message: '@',
      type: '@?', // error, warning or info for now
      dismissable: '@?'
    },
    templateUrl: 'components/controls/message.template.html',
    controller: function () {
      this.$onInit = function () {
        if (angular.isUndefined(this.type)) {
          this.type = 'info';
        }
        if (angular.isUndefined(this.dismissable)) {
          this.dismissable = true;
        }
        this.hidden = sessionStorage.getItem('hideMessage' + this.id);
      };

      this.dismissMessage = function () {
        sessionStorage.setItem('hideMessage' + this.id, true);
        this.hidden = true;
      };
    }
  });
}());
