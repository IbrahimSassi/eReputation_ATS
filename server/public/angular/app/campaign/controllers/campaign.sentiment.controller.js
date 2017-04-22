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
    vm.since = moment().subtract(20,"days");

    var filterSentimental =
      {
        "since": "2017-04-07T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.idCampaign
      };

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

/*      WwsaService.stackedbarchart(vm.idCampaign).then(function (data) {
          vm.neutral_today = data.data1[0].neutral_score;
          vm.positive_today = data.data1[0].positive_score;
          vm.negative_today = data.data1[0].negative_score;
          vm.neutral_last = data.data2[0].neutral_score;
          vm.positive_last = data.data2[0].positive_score;
          vm.negative_last = data.data2[0].negative_score;
          vm.neutral_lastD = data.data3[0].neutral_score;
          vm.positive_lastD = data.data3[0].positive_score;
          vm.negative_lastD = data.data3[0].negative_score;
        //  console.info('succ: ',data.data[0].neutral_score);
      }).catch(function (err) {
          console.error('error: ',err);
      })

      WwsaService.combobarchart(vm.idCampaign,vm.idChannel).then(function (data) {
          vm.neutral_todayy = data.data1[0].neutral_score;
          vm.positive_todayy = data.data1[0].positive_score;
          vm.negative_todayy = data.data1[0].negative_score;
          vm.avg_todayy= ((data.data1[0].neutral_score+data.data1[0].positive_score+data.data1[0].negative_score)/3)

          vm.neutral_yes = data.data2[0].neutral_score;
          vm.positive_yes = data.data2[0].positive_score;
          vm.negative_yes = data.data2[0].negative_score;
          vm.avg_yes= ((data.data2[0].neutral_score+data.data2[0].positive_score+data.data2[0].negative_score)/3)


          vm.neutral_old = data.data3[0].neutral_score;
          vm.positive_old = data.data3[0].positive_score;
          vm.negative_old = data.data3[0].negative_score;
          vm.avg_old= ((data.data3[0].neutral_score+data.data3[0].positive_score+data.data3[0].negative_score)/3)


          vm.neutral_oold = data.data4[0].neutral_score;
          vm.positive_oold = data.data4[0].positive_score;
          vm.negative_oold = data.data4[0].negative_score;
          vm.avg_oold= ((data.data4[0].neutral_score+data.data4[0].positive_score+data.data4[0].negative_score)/3)

          vm.neutral_ooold = data.data5[0].neutral_score;
          vm.positive_ooold = data.data5[0].positive_score;
          vm.negative_ooold = data.data5[0].negative_score;
          vm.avg_ooold= ((data.data5[0].neutral_score+data.data5[0].positive_score+data.data5[0].negative_score)/3)

            console.info('succ vm.avg_todayy : ',vm.avg_todayy);
      }).catch(function (err) {
          console.error('error: ',err);
      });
*/



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

        filterSentimentalForCampaign.since = moment(vm.since).format();//2017-04-02
        filterSentimentalForCampaign.until = moment(vm.until).format();
        filterSentimentalForCampaign.channelId = "all";
        filterSentimentalForCampaign.campaignId =vm.idCampaign ;



        filterSentimentalForTwitter.since = moment(vm.since).format();//2017-04-02
        filterSentimentalForTwitter.until = moment(vm.until).format();
        filterSentimentalForTwitter.source = "tweetsProvider";
        filterSentimentalForTwitter.campaignId =vm.idCampaign ;

        filterSentimentalForfb.since = moment(vm.since).format();//2017-04-02
        filterSentimentalForfb.until = moment(vm.until).format();
        filterSentimentalForfb.source = "FacebookPostsProvider";
        filterSentimentalForfb.campaignId =vm.idCampaign


        filterSentimentalForWebsites.since = moment(vm.since).format();//2017-04-02
        filterSentimentalForWebsites.until = moment(vm.until).format();
        filterSentimentalForWebsites.source = "websitesProvider";
        filterSentimentalForWebsites.campaignId =vm.idCampaign ;

        initSentimentalCampaignData()

      }
    };




    var filterSentimentalForCampaign =
      {
        "since":"2017-04-07T02:35:14+01:00",
        "until":"2017-04-12T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.idCampaign
      };


    var filterSentimentalForTwitter =
      {
        "since":"2017-04-07T02:35:14+01:00",
        "until":"2017-04-12T19:35:14+01:00",
        "source": "tweetsProvider",
        "campaignId": vm.idCampaign
      };

    var filterSentimentalForfb =
      {
        "since":"2017-04-07T02:35:14+01:00",
        "until":"2017-04-12T19:35:14+01:00",
        "source": "FacebookPostsProvider",
        "campaignId": vm.idCampaign
      }

      var filterSentimentalForWebsites=
        {
          "since":"2017-04-07T02:35:14+01:00",
          "until":"2017-04-12T19:35:14+01:00",
          "source": "websitesProvider",
          "campaignId": vm.idCampaign
        }


    function initSentimentalCampaignData() {
      console.log("/////////////////")

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


