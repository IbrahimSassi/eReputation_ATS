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
       console.log("idfromCTRL",idfromCTRL)
          return WwsaFactory.PositivitybyCompaign({id:idfromCTRL}).$promise;
      };
      var getNegativity = function (idfromCTRL) {
          console.log("idfromCTRL",idfromCTRL)
          return WwsaFactory.NegativityByCompaign({id:idfromCTRL}).$promise;
      };
      var getNeutrality = function (idfromCTRL) {
          console.log("idfromCTRL",idfromCTRL)
          return WwsaFactory.NeutralByCompaign({id:idfromCTRL}).$promise;
      };

      var stackedbarchart = function (idfromCTRL) {
          return WwsaFactory.stackedbar({id:idfromCTRL}).$promise;
      };

      var combobarchart = function (idcam,idch) {
          console.log("idcam",idcam,idch)
          return WwsaFactory.combochart({idcam:idcam,idch:idch}).$promise;
      };
      return {
          getPositivity: getPositivity,
          getNegativity: getNegativity,
          getNeutrality:getNeutrality,
          stackedbarchart:stackedbarchart,
          combobarchart:combobarchart

      };
  }


})();

