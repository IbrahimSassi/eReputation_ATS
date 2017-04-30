/**
 * Created by Ibrahim on 29/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .service('UtilsService', UtilsService);

  UtilsService.$inject = [];

  /* @ngInject */
  function UtilsService() {
    this.AlertToast = AlertToastFn;


    function AlertToastFn(message, type, delai) {
      var $toastContent = message;
      var rounded = type;
      Materialize.toast($toastContent, delai, rounded);

    }
  }

})();
