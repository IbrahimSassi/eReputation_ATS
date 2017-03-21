/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .service('CampaignService', CampaignServiceFN);

  CampaignServiceFN.$inject = ['CampaignFactory'];


  function CampaignServiceFN(CampaignFactory) {


    this.getAllUsers = function () {

      return CampaignFactory.query().$promise;

    }


  }


})();

