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

  CampaignCtrl.$inject = ['CampaignService', 'ChannelService', '$state', 'angularLoad', '$scope', '$rootScope','$q'];
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


  function CampaignCtrl(CampaignService, ChannelService, $state, angularLoad, $scope, $rootScope,$q) {

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


    // $rootScope.currentUser._id='58dcdfb7007df41d241782f7';


    $scope.channels = [];

    vm.addChannels = function (channel) {
      if(vm.extractDomain(channel.url).toLowerCase().indexOf('facebook')!=-1
        || vm.extractDomain(channel.url).toLowerCase().indexOf('twitter')!=-1 )
      {}
      else
      {
        channel.url=vm.extractDomain(channel.url);
      }
      ChannelService.addChannel(channel).then(function (dataChannel) {
        console.log(dataChannel);
        $scope.channels.push(dataChannel);
      });
    }


    vm.addCampaign = function (campaign) {
      campaign.channel.userId = $rootScope.currentUser._id;

      console.log(channels);
      campaign.channels = channels;
      campaign.dateStart = moment(campaign.dateStart, 'DD/MM/YYYY');
      campaign.dateEnd = moment(campaign.dateEnd, 'DD/MM/YYYY');
      campaign.userId = $rootScope.currentUser._id;

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
      campaign.channel.personal === undefined ? false : campaign.channel.personal;

      CampaignService.addCampaign(campaign).then(function (data) {
        console.log("Campaign Added");
        console.log(data);
      }).catch(function (err) {
        // console.log("NOT Campaign Added");
        // console.log(data);
      });


    };

    vm.getAllMyChannels = function () {
      ChannelService.getChannelsByUser($rootScope.currentUser._id).then(function (data) {
        console.log(data);
        vm.allMyChannels = data;
      });
    };

    vm.setColor=function(url)
    {
      if(vm.extractDomain(url).toLowerCase().indexOf('facebook')!=-1)
      {
        return "light-blue darken-3";
      }
      else if(vm.extractDomain(url).toLowerCase().indexOf('twitter')!=-1)
      {
        return "cyan accent-3";
      }
      else
      {
        return "green lighten-1";
      }


    }


   vm.extractDomain=  function(url) {
      var domain;
      //find & remove protocol (http, ftp, etc.) and get domain
      if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
      }
      else {
        domain = url.split('/')[0];
      }

      //find & remove port number
      domain = domain.split(':')[0];

      return domain;
    };



    vm.isImage=function(src) {

      var deferred = $q.defer();

      var image = new Image();
      image.onerror = function() {
        deferred.resolve(false);
      };
      image.onload = function() {
        deferred.resolve(true);
      };
      image.src = src;

      return deferred.promise;
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


