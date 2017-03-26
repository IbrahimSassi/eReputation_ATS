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
    var myCampaign = {
      "name": "Iphone 87",
      "url": "https://www.apple.com/iphone/olaola",
      "description": "iphone 7 campaign ola",
      "dateStart": "2017-03-24T23:00:00.000Z",
      "dateEnd": "2017-06-04T23:00:00.000Z",
      "phoneNumber": "0088414652",
      "userId": "58d3dc815d391346a06f48c3",
      "location": [
        {
          "latitude": 123.123,
          "longitude": 55.55
        }
      ],
      "keywords": [
        {
          "content": "Iphone 8 price",
          "importance": "low"
        }
      ],
      "channels": [
        {
          "channelId": "58d1825eb8224d1ee822642f"
        }
      ]
    }

    vm.addCampaign = function (campaign) {
      campaign.dateStart= moment(campaign.dateStart,'DD/MM/YYYY');
      campaign.dateEnd=moment(campaign.dateEnd,'DD/MM/YYYY');
      campaign.userId = '58d3dc815d391346a06f48c3';

      campaign.location = [
        {
          "latitude": 123.123,
          "longitude": 55.55
        }
      ];
      campaign.keywords = [
        {
          "content": "Iphone 8 price",
          "importance": "low"
        }
      ];
      campaign.channels = [
        {
          "channelId": "58d1825eb8224d1ee822642f"
        }
      ];


      CampaignService.addCampaign(campaign).then(function (data) {
        console.log("Campaign Added");
        console.log(data);
      }).catch(function (err) {
        console.log("NOT Campaign Added");
        console.log(data);
      });
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


