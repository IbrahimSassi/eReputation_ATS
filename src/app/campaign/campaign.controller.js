(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign', [

    ])
    .config(config)
    .controller('CampaignCtrl', CampaignCtrlFN);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  CampaignCtrlFN.$inject = ['$state','$rootScope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('campaignCreate', {
        url: '/campaign/create',
        templateUrl: 'campaign/views/campaign.view.html',
        controller: 'CampaignCtrl as vm',
        // comp:true
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  function CampaignCtrlFN($state,$rootScope) {

    /**Scope Replace**/
    var vm = this;

    // $rootScope.comp=true;
    //
    // if($rootScope.comp==true)
    //   $rootScope.compo=true;


    /***/



  };


})();


