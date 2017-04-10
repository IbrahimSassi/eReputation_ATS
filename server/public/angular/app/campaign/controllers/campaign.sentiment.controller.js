/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign')
    .controller('CampaignSentimentCtrl', CampaignSentimentCtrl);

  /**End My Module Init**/

  /**Injection**/


  CampaignSentimentCtrl.$inject = ['CampaignService', 'ChannelService', 'FacebookService', 'angularLoad', '$scope', '$rootScope', '$stateParams','WwsaService'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignSentimentCtrl(CampaignService, ChannelService, FacebookService, angularLoad, $scope, $rootScope, $stateParams,WwsaService) {

    /**Scope Replace**/
    var vm = this;
    vm.idCampaign = $stateParams.idCampaign;

    /**
     * View Detail Methods
     */

    vm.getCampaignDetail = function (id) {
      if (id !== undefined) {
        CampaignService.getCampaignById(id).then(function (data) {
          console.info(data);
          vm.detailCampaign = data[0];
        }).catch(function (err) {
          console.error(err);
        });
      }

    }

    vm.getCampaignDetail(vm.idCampaign);

    /***
     * End
     */


    /** Scripts Loading first Refresh **/
    angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
      // angularLoad.loadScript('angular/app/assets/js/charts/narimen/columnchart.js').then(function () {
      //
      // }).catch(function () {
      //   console.log('err script 1');
      // });
    }).catch(function () {
      console.log('err script 1');
    });
    /** END of Scripts Loading first Refresh **/



    //My Work

    WwsaService.getPositivity(vm.idCampaign).then(function (data) {

    vm.positive = data.data[0].positive_score;




        console.info('succ: ',data.data[0].positive_score);
    }).catch(function (err) {
        console.error('error: ',err);
    });






  };


})();


