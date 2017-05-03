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



     var CompaignSentimental= function (filter) {
       return WwsaFactory.CompaignSentimental(filter).$promise;
    }
    var ChannelSentimental =function (filter) {
      return WwsaFactory.ChannelSentimental(filter).$promise;
    }

    var FbSentimental=function (filter) {
      return WwsaFactory.FbSentimental(filter).$promise;
    }
    var WebSentimental =function (filter) {
      return WwsaFactory.WebSentimental(filter).$promise;
    }
      return {
          getPositivity: getPositivity,
          getNegativity: getNegativity,
          getNeutrality:getNeutrality,
          CompaignSentimental:CompaignSentimental,
          ChannelSentimental:ChannelSentimental,
          FbSentimental:FbSentimental,
        WebSentimental:WebSentimental

      };
  }


})();

