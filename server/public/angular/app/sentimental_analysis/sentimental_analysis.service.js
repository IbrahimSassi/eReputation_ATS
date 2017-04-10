/**
 * Created by ninou on 3/29/2017.
 */



(function () {
  'use strict';

  angular
    .module('ATSApp.wwsa')
    .service('WwsaService', WwsaServiceFN);

  WwsaServiceFN.$inject = ['WwsaFactory'];


  function WwsaServiceFN(WwsaFactory) {


      var getPositivity = function (idfromCTRL) {

          return WwsaFactory.PositivitybyCompaign({id:idfromCTRL}).$promise;
      };

      return {
          getPositivity: getPositivity
      };
  }


})();

