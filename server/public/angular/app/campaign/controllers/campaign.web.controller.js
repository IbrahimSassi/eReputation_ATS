/**
 * Created by HP on 06/04/2017.
 */
/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign')
    .controller('CampaignWebCtrl', CampaignWebCtrl);

  /**End My Module Init**/

  /**Injection**/


  CampaignWebCtrl.$inject = ['CampaignService', 'ChannelService', 'WebsitesService', 'angularLoad', '$scope', '$rootScope', '$stateParams'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignWebCtrl(CampaignService, ChannelService, WebsitesService, angularLoad, $scope, $rootScope, $stateParams) {

    /**Scope Replace**/
    var vm = this;
    vm.idCampaign = $stateParams.idCampaign;
    //

    /**
     * View Detail Methods
     */

    vm.getWebsitesProviderAll = function (id) {
      var myFilter = {
        "campaignId": vm.idCampaign,
        "channelId": id
      }
      WebsitesService.getWebsitesProvider(myFilter).then(function (data) {
        $scope.tableAllAnalysis = [];
        $scope.tableAllAnalysis.push(["date", "positive", "negative", "neutre"]);
        data.forEach(function (arr) {
          $scope.tableAllAnalysis.push([
            arr._id.dateContent,
            parseFloat(arr.positive_score)
            , parseFloat(arr.negative_score)
            , parseFloat(arr.neutral_score)
          ]);
        });

      }).catch(function (err) {
        ;
      });
    };


    vm.getWebsitesAnalysisByKeywords = function (keyword) {
      $scope.currentKeyword=keyword;
      var myFilter = {
        "campaignId": vm.idCampaign,
        "keyword": keyword
      }
      WebsitesService.getWebsitesAnalysisKeywords(myFilter).then(function (data) {
        $scope.tableAllAnalysisSpec = [];
        $scope.generalSentimentByKeyword = {};
        var positive = 0;
        var negative = 0;
        var neutral = 0;
        $scope.tableAllAnalysisSpec.push(["date", "positive", "negative", "neutral"]);
        $scope.websitesMoyKeywords = data[0];
        data.forEach(function (vrr, index) {
          $scope.tableAllAnalysisSpec.push(
            [
              vrr._id.dateContent,
              parseFloat(vrr.positive_score)
              , parseFloat(vrr.negative_score)
              , parseFloat(vrr.neutral_score)
            ]);
          positive += parseFloat(vrr.positive_score);
          negative += parseFloat(vrr.negative_score);
          neutral += parseFloat(vrr.neutral_score);
          if (index == data.length - 1) {
            $scope.generalSentimentByKeyword.positive_score = positive / data.length;
            $scope.generalSentimentByKeyword.negative_score = negative / data.length;
            $scope.generalSentimentByKeyword.neutral_score = neutral / data.length;
          }
        });


      }).catch(function (err) {
      });

      WebsitesService.getWebsitesAnalysisKeywordsNeg(myFilter).then(function (negData) {
        $scope.negArticles=negData;

      });
      WebsitesService.getWebsitesAnalysisKeywordsPos(myFilter).then(function (posData) {
        $scope.posArticles=posData;
      });

    }


    vm.getWebsitesProvider = function (channelId) {
      var myFilter = {
        "campaignId": vm.idCampaign,
        "channelId": channelId
      }
      WebsitesService.getWebsitesProvider(myFilter).then(function (data) {
        $scope.tableAllAnalysisSpec = [];
        $scope.tableAllAnalysisSpec.push(["date", "positive", "negative", "neutre"]);
        $scope.websitesChannels = data[0];
        data.forEach(function (vrr) {
          $scope.tableAllAnalysisSpec.push(
            [
              vrr._id.dateContent,
              parseFloat(vrr.positive_score)
              , parseFloat(vrr.negative_score)
              , parseFloat(vrr.neutral_score)
            ]);
        });
      }).catch(function (err) {
      });

      ChannelService.getChannelByID(channelId).then(function (channelData) {

        WebsitesService.getAllwebSitesProvider().then(function (webData) {
          $scope.allWebsitesSearch = [];
          webData.forEach(function (exactData) {
            if (channelId == exactData.channelId) {
              $scope.allWebsitesSearch.push(exactData);
            }
          })


        }).catch(function (err) {
        });

        WebsitesService.getWebsitesAnalysis(channelData.url).then(function (data) {
          $scope.websitesAnalysis = data;
        }).catch(function (err) {
        });
      });


    };
    // vm.getWebsitesProvider(
    //   {
    //     "campaignId":vm.idCampaign ,
    //     "channelId": "all"
    //   }
    // );

    $scope.channelsofThisCampaign = [];
    $scope.keywordsofThisCampaign = [];
    vm.getListOfWebsitesChannels = function () {

      CampaignService.getCampaignById(vm.idCampaign).then(function (campaign) {
        campaign[0].channels.forEach(function (campa) {

          ChannelService.getChannelByID(campa.channelId).then(function (data) {
            if (data.type === 'website') {
              $scope.channelsofThisCampaign.push(data);
            }

          });
        });
      });
    };

    vm.getListOfWebsitesKeywords = function () {

      CampaignService.getCampaignById(vm.idCampaign).then(function (campaign) {
        $scope.keywordsofThisCampaign = campaign[0].keywords;
      });
    };


    vm.getListOfWebsitesChannels();
    vm.getListOfWebsitesKeywords();


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
      //
    });

    /** END of Scripts Loading first Refresh **/

  };


})();


