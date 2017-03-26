/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign', [
      'ui.router',

    ])
    .config(config)
    .controller('CampaignCtrl', CampaignCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$qProvider'];

  CampaignCtrl.$inject = ['CampaignService', '$state', 'angularLoad', '$scope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $qProvider) {

    $stateProvider
      .state('campaignCreate', {
        url: '/campaign/create',
        templateUrl: '../angular/app/campaign/views/create.campaign.view.html',
        controller: 'CampaignCtrl as camp'
      })
      .state('campaignList', {
        url: '/campaign/list',
        templateUrl: '../angular/app/campaign/views/list.campaign.view.html',
        controller: 'CampaignCtrl as camp'
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  }
  /**End of Route Config**/


  function CampaignCtrl(CampaignService, $state, angularLoad, $scope) {

    /**Scope Replace**/
    var vm = this;

    vm.getAllCampaigns = function () {
      CampaignService.getAllCampaigns().then(function (data) {
        vm.campaigns = data;
        //$scope.myId='58d5810511260618b0196d4e';
        console.log(vm.campaigns);
      });
    };

    vm.deleteCampaign = function (campaign) {
      CampaignService.deleteCampaign(campaign);
      vm.getAllCampaigns();

    };


    /** Scripts Loading first Refresh **/
    // angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
    //   angularLoad.loadScript('angular/app/assets/js/charts/chartTest.js').then(function () {
    //
    //   }).catch(function () {
    //     console.log('err script 1');
    //   });
    // }).catch(function () {
    //   console.log('err script 1');
    // });
    /** END of Scripts Loading first Refresh **/

  };

  /**End UserCtrl Function**/

})();


