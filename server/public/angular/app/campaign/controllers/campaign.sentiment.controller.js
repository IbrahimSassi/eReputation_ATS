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
    vm.idChannel = "58dd0dfc6a60631dbc879ddb";

    vm.until = moment();

    var filterSentimental =
      {
        "since": vm.since,
        "until": vm.until,
        "channelId": "all",
        "campaignId": vm.idCampaign
      };

    /**
     * View Detail Methods
     */



    var filterSentimentalForCampaign =
      {
        "since":vm.since,
        "until":vm.until,
        "channelId": "all",
        "campaignId": vm.idCampaign
      };


    var filterSentimentalForTwitter =
      {
        "since":vm.since,
        "until":vm.until,
        "source": "tweetsProvider",
        "campaignId": vm.idCampaign
      };

    var filterSentimentalForfb =
      {
        "since":vm.since,
        "until":vm.until,
        "source": "FacebookPostsProvider",
        "campaignId": vm.idCampaign
      }

    var filterSentimentalForWebsites=
      {
        "since":vm.since,
        "until":vm.until,
        "source": "websitesProvider",
        "campaignId": vm.idCampaign
      }



    initSentimentalCampaignData();

    vm.getCampaignDetail = function (id) {
      if (id !== undefined) {
        CampaignService.getCampaignById(id).then(function (data) {
          console.info(data);
          vm.detailCampaign = data[0];
          vm.minDate = moment(data[0].dateStart).subtract(1,'days');;
          vm.maxDate = moment(data[0].dateEnd);
          vm.since = moment(data[0].dateStart).subtract(1,'days');
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

      WwsaService.getNegativity(vm.idCampaign).then(function (data) {
          vm.negative = data.data[0].negative_score;
          console.info('succ: ',data.data[0].negative_score);
      }).catch(function (err) {
          console.error('error: ',err);
      });

      WwsaService.getNeutrality(vm.idCampaign).then(function (data) {
          vm.neutral = data.data[0].neutral_score;
          console.info('succ: ',data.data[0].neutral_score);
      }).catch(function (err) {
          console.error('error: ',err);
      });




    //OnDateChange
    vm.onChange = function () {
      console.log("onChange", vm.since);
      console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else if (new Date(vm.until) > new Date() || new Date(vm.since) > new Date()) {
        Materialize.toast("Until Date or Since Date Can t be greater than today", 3000, "rounded");
      }

      else {

        filterSentimentalForCampaign.since = vm.since;//2017-04-02
        filterSentimentalForCampaign.until = vm.until;
        filterSentimentalForCampaign.channelId = "all";
        filterSentimentalForCampaign.campaignId =vm.idCampaign ;



        filterSentimentalForTwitter.since = vm.since;//2017-04-02
        filterSentimentalForTwitter.until = vm.until;
        filterSentimentalForTwitter.source = "tweetsProvider";
        filterSentimentalForTwitter.campaignId =vm.idCampaign ;

        filterSentimentalForfb.since = vm.since;//2017-04-02
        filterSentimentalForfb.until = vm.until;
        filterSentimentalForfb.source = "FacebookPostsProvider";
        filterSentimentalForfb.campaignId =vm.idCampaign


        filterSentimentalForWebsites.since = vm.since;
        filterSentimentalForWebsites.until = vm.until;
        filterSentimentalForWebsites.source = "websitesProvider";
        filterSentimentalForWebsites.campaignId =vm.idCampaign ;

        initSentimentalCampaignData()

      }
    };






    function initSentimentalCampaignData() {


      $scope.SentimentalCampaignData = [];

      WwsaService.CompaignSentimental(filterSentimentalForCampaign)
        .then(function (data) {

          $scope.SentimentalCampaignData.push(['Date', 'Postivity', 'Negativity', 'Neutrality']);
          data.forEach(function (sentim) {
            $scope.SentimentalCampaignData.push(
              [
                sentim._id.dateContent, sentim.positive_score, sentim.negative_score, sentim.neutral_score
              ]
            );
          });

        }).catch(function (err) {
        console.error('error: ', err);
      });


      $scope.SentimentalChannelData = [];

      WwsaService.ChannelSentimental(filterSentimentalForTwitter)
        .then(function (data) {

          $scope.SentimentalChannelData.push(['Date', 'Postivity', 'Negativity', 'Neutrality', 'avg']);
          data.forEach(function (sentim) {
            $scope.SentimentalChannelData.push(
              [
                sentim._id.dateContent, sentim.positive_score, sentim.negative_score, sentim.neutral_score, sentim.avg / 3
              ]
            );
          });

        }).catch(function (err) {
        console.error('error: ', err);
      });






      $scope.SentimentalFBData = [];

      WwsaService.FbSentimental(filterSentimentalForfb)
        .then(function (data) {

          $scope.SentimentalFBData.push(['Date', 'Postivity', 'Negativity', 'Neutrality', 'avg']);
          data.forEach(function (sentim) {
            console.log("sentim: ",sentim);
            $scope.SentimentalFBData.push(
              [
                sentim._id.dateContent, sentim.positive_score, sentim.negative_score, sentim.neutral_score, sentim.avg / 3
              ]
            );
          });

        }).catch(function (err) {
        console.error('error: ', err);
      });



      $scope.SentimentalWebData = [];

      WwsaService.WebSentimental(filterSentimentalForWebsites)
        .then(function (data) {

          $scope.SentimentalWebData.push(['Date', 'Postivity', 'Negativity', 'Neutrality', 'avg']);
          data.forEach(function (sentim) {
            $scope.SentimentalWebData.push(
              [
                sentim._id.dateContent, sentim.positive_score, sentim.negative_score, sentim.neutral_score, sentim.avg / 3
              ]
            );
          });

        }).catch(function (err) {
        console.error('error: ', err);
      });





    }





  };



})();


