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


    this.getAllCampaigns = function () {

      return CampaignFactory.query().$promise;

    }

    this.deleteCampaign =function (campaign) {
      return campaign.$delete({id: campaign._id});
    }





  }


})();

