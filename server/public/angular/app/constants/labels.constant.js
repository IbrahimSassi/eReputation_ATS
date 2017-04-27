/**
 * Created by Ibrahim on 27/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.utils',[])
    .factory('ConstantFactory', ConstantFactory);

  ConstantFactory.$inject = [];

  /* @ngInject */
  function ConstantFactory() {
    var service = {
      POSITIVE : "Positive",
      NEGATIVE : "Negative",
      NEUTRAL : "Neutral",
      POSITIVITY : "Positivity",
      NEGATIVITY : "Negativity",
      NEUTRALITY : "Neutrality",
      TYPE : "Type",
      AVG : "Avg",
      DATE : "Date",
      SENTIMENTAL : "Sentimental",
      NUMBER : "Number"
    };
    return service;

    ////////////////


  }

})();

