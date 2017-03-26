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
    /**
     *  Get All Campaigns
     * @returns {*|Function}
     */
    this.getAllCampaigns = function () {
      return CampaignFactory.query().$promise;
    }
    /**
     * Delete Campaign
     * @param campaign
     * @returns {*}
     */
    this.deleteCampaign = function (campaign) {
      return campaign.$delete({id: campaign._id});
    }
    /**
     * Add Campaign
     * @param campaign
     * @returns {*|Function}
     */
    this.addCampaign = function (campaign) {
      return CampaignFactory.save(campaign).$promise;
    }


  }


})();

