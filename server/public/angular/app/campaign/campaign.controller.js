/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign', [
      'ui.router',
      'ja.qr'
    ])
    .config(config)
    .controller('CampaignCtrl', CampaignCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$qProvider', '$urlRouterProvider'];

  CampaignCtrl.$inject = ['CampaignService', 'ChannelService', 'FacebookService', 'angularLoad', '$scope', '$rootScope', '$stateParams', '$state'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $qProvider, $urlRouterProvider) {

    $stateProvider
      .state('campaignCreate', {
        url: '/campaign/create',
        templateUrl: 'angular/app/campaign/views/create.campaign.view.html',
        controller: 'CampaignCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignEdit', {
        url: '/campaign/edit/:idCampaign',
        templateUrl: 'angular/app/campaign/views/edit.campaign.view.html',
        controller: 'CampaignCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignList', {
        url: '/campaign/list',
        templateUrl: 'angular/app/campaign/views/list.campaign.view.html',
        controller: 'CampaignCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail', {
        url: '/campaign/detail/:idCampaign',
        templateUrl: 'angular/app/campaign/views/detail.campaign.view.html',
        controller: 'CampaignCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail.campaignSentimentAnalysis', {
        url: '/sentiment',
        templateUrl: 'angular/app/campaign/views/analysis/sentiment.campaign.view.html',
        controller: 'CampaignSentimentCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail.campaignFbAnalysis', {
        url: '/facebook',
        templateUrl: 'angular/app/campaign/views/analysis/fb.campaign.global.view.html',
        controller: 'CampaignFbCtrl as vm',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail.campaignFbAnalysis.overview', {
        url: '/overview',
        templateUrl: 'angular/app/campaign/views/analysis/fb.campaign.view.html',
        controller: 'CampaignFbCtrl as vm',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail.campaignTwitterAnalysis', {
        url: '/twitter',
        templateUrl: 'angular/app/campaign/views/analysis/tw.campaign.view.html',
        controller: 'CampaignTwCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
      .state('campaignDetail.campaignWebAnalysis', {
        url: '/web',
        templateUrl: 'angular/app/campaign/views/analysis/web.campaign.view.html',
        controller: 'CampaignWebCtrl as camp',
        authenticate: true,
        shouldConfirmed: true
      })
    ;


    $qProvider.errorOnUnhandledRejections(false);


  }

  /**End of Route Config**/


  function CampaignCtrl(CampaignService, ChannelService, FacebookService, angularLoad, $scope, $rootScope, $stateParams, $state) {

    /**Scope Replace**/
    var vm = this;
    vm.idCampaign = $stateParams.idCampaign;
    $scope.allChannelTodisplay = [];
    $scope.allChannelEditTodisplay = [];
    $scope.allChannelEditTodisplayId = [];
    $scope.channels = [];
    $scope.channelsId = [];
    $scope.keywords = [];
    $scope.keywordsToEdit = [];
    $scope.dateMin = moment().subtract(7, 'days');
    $scope.$watch('toStartDate', function (newValue, oldValue) {
      $scope.dateEndMin = moment(newValue, 'DD/MM/YYYY').add(1, 'days').format('MM/DD/YYYY');
    }, true);
    /**
     * View Detail Methods
     */



    vm.displayEdit = function (id) {
      CampaignService.getCampaignById(id).then(function (data) {
        $scope.keywordsToEdit = data[0].keywords;
        $scope.campaignToEdit = data[0];
        data[0].channels.forEach(function (channelPartial) {
          ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
            $scope.allChannelEditTodisplay.push(channel);
            $scope.allChannelEditTodisplayId.push({'channelId': channel._id});
          });
        });
      }).catch(function (err) {
      });

    };

    if (vm.idCampaign && $state.includes('campaignEdit')) {
      vm.displayEdit(vm.idCampaign);
    }

    vm.getCampaignDetail = function (id) {
      if (id !== undefined) {
        CampaignService.getCampaignById(id).then(function (data) {
          vm.detailCampaign = data[0];
          data[0].channels.forEach(function (channelPartial) {
            ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
              $scope.allChannelTodisplay.push(channel);
            });
          });
        }).catch(function (err) {
        });
      }

    }

    vm.getCampaignDetail(vm.idCampaign);

    /***
     * End
     */

    vm.getAllCampaigns = function () {
      CampaignService.getAllCampaigns().then(function (data) {
        vm.campaigns = [];
        data.forEach(function (campaign) {
          if ($rootScope.currentUser._id === campaign.userId) {
            vm.campaigns.push(campaign);
          }

        })

      });
    };

    vm.deleteCampaign = function (campaign) {

      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Campaign !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function () {
          CampaignService.deleteCampaign(campaign);
          vm.getAllCampaigns();
          swal("Deleted!", "Your Campaign has been deleted.", "success");
        });


    };


    // $rootScope.currentUser._id='58dcdfb7007df41d241782f7';


    vm.addChannels = function (channel) {
      //add only domain name exemple www.ifm.tn
      var test = 0;
      if (!channel.name) {
        test++;
        swal({
          title: "Problem !",
          text: "Channel not Created ! \n  please verify \"Channel Name ! \"",
          type: "warning",
        });
      }
      if (!channel.type) {
        test++;
        swal({
          title: "Problem !",
          text: "Channel not Created ! \n  please verify \"Channel type ! \"",
          type: "warning",
        });
      }
      if (!channel.url) {
        test++;
        swal({
          title: "Problem !",
          text: "Channel not Created ! \n  please verify \"Channel URL ! \"",
          type: "warning",
        });
      }
      if (test === 0) {
        if (vm.extractDomain(channel.url).toLowerCase().indexOf('facebook') != -1
          || vm.extractDomain(channel.url).toLowerCase().indexOf('twitter') != -1) {
        }
        else {
          channel.url = vm.extractDomain(channel.url);
        }
        channel.userId = $rootScope.currentUser._id;
        if (channel.personal === undefined) {
          channel.personal = false;
        }
        //end
        $scope.myChannelAaccessToken === undefined ? '' : channel.accessToken = $scope.myChannelAaccessToken;
        //Call Service Add Channel Function


        ChannelService.addChannel(channel).then(function (dataChannel) {
          vm.pushChannelId(dataChannel._id, true)
        }).catch(function (err) {
        });

        //end
      }

    };

    vm.pushChannelId = function (idChannel, isNew) {

      $scope.channelsId.push({'channelId': idChannel, 'isNew': isNew});
      $scope.allChannelEditTodisplayId.push({'channelId': idChannel, 'isNew': isNew});
      ChannelService.getChannelByID(idChannel).then(function (dataChannel) {
        $scope.channels.push(dataChannel);
        $scope.allChannelEditTodisplay.push(dataChannel);
      });

    };
    vm.removeChannelsFromAdd = function (index) {

      var idChannelToDelete = $scope.channelsId[index] !== undefined
        ? $scope.channelsId[index].channelId
        : $scope.allChannelEditTodisplay[index]._id;
      if ($scope.channelsId[index] !== undefined) {
        if ($scope.channelsId[index].isNew === true) {
          ChannelService.getChannelByID(idChannelToDelete).then(function (dataChannel) {
            ChannelService.deleteChannel(dataChannel).then(function () {
              $scope.channelsId.splice(index, 1);

            });
          });
        }
        if ($scope.channelsId[index].isNew === false) {
          $scope.channelsId.splice(index, 1);
          $scope.allChannelEditTodisplayId.splice(index, 1);
        }
      }
      else {
        $scope.allChannelEditTodisplayId.splice(index, 1);
      }


    };


    vm.addKeywords = function (keyword, edit) {
      if (edit === true) {
        $scope.keywordsToEdit.push(
          {
            "content": keyword.content,
            "importance": keyword.importance
          }
        );
      }
      else {
        $scope.keywords.push(
          {
            "content": keyword.content,
            "importance": keyword.importance
          }
        );
      }


    };
    vm.removeKeywordsFromAdd = function (index, edit) {
      if (edit === true) {
        $scope.keywordsToEdit.splice(index, 1);
      }
      else {
        $scope.keywords.splice(index, 1);
      }

    };


    /**
     * addCampaign
     * @param campaign
     */
    vm.addCampaign = function (campaign) {
      // init vars
      campaign.userId = $rootScope.currentUser._id;
      // campaign.channel.personal === undefined ? false : campaign.channel.personal;
      campaign.channels = $scope.channelsId;
      campaign.dateStart = moment(campaign.dateStart, 'DD/MM/YYYY');
      campaign.dateEnd = moment(campaign.dateEnd, 'DD/MM/YYYY');
      campaign.keywords = $scope.keywords;

      // end init vars
      CampaignService.addCampaign(campaign).then(function (data) {
        swal({
            title: "Good job!",
            text: "Campaign Created !",
            type: "success",
          },
          function () {
            $state.go("campaignList");
          });
      }).catch(function (err) {

        swal({
          title: "Problem !",
          text: "Campaign NOT Created ! \n  please verify entries ...",
          type: "warning",
        });
      });
    };


    vm.editCampaign = function (campaignToEdit) {
      campaignToEdit.channels = $scope.allChannelEditTodisplayId;
      CampaignService.editCampaign(campaignToEdit).then(function (data) {
        swal({
            title: "Good job!",
            text: "Campaign Edited !",
            type: "success",
          },
          function () {
            $state.go("campaignList");
          });
      }).catch(function (err) {

        swal({
          title: "Problem !",
          text: "Campaign NOT Edited ! \n  please verify entries ...",
          type: "warning",
        });
      });
    };


    /**
     * getAllMyChannels
     */
    vm.getAllMyChannels = function () {
      ChannelService.getChannelsByUser($rootScope.currentUser._id).then(function (data) {
        vm.allMyChannels = data;
      });
    };


    /***
     * setColor
     * @param url
     * @returns {*}
     */

    vm.setColor = function (url) {
      if (vm.extractDomain(url).toLowerCase().indexOf('facebook') != -1) {
        return "light-blue darken-3";
      }
      else if (vm.extractDomain(url).toLowerCase().indexOf('twitter') != -1) {
        return "cyan accent-3";
      }
      else {
        return "green lighten-1";
      }


    };


    vm.extractDomain = function (url) {
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


    $scope.myFacebookPages = [];
    vm.getPermissions = function () {
      FacebookService.initFacebookApi()
        .then(function (data) {
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            console.log("new long" + newLongToken);
            $scope.myChannelAaccessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              $scope.myFacebookPages.push({value: "https://www.facebook.com/" + page.id, text: page.name})
              var $toastContent = $('<span class="green-text">Your permission has granted , now pick a page</span>');
              var rounded = "rounded"
              Materialize.toast($toastContent, 3000, rounded);

            });
          })

        });
    };


    /** Scripts Loading first Refresh **/
    // angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
    //   // angularLoad.loadScript('angular/app/assets/js/charts/chartTest.js').then(function () {
    //   //
    //   // }).catch(function () {
    //   //   console.log('err script 1');
    //   // });
    // }).catch(function () {
    //   console.log('err script 1');
    // });
    /** END of Scripts Loading first Refresh **/

  };

  /**End UserCtrl Function**/

})();


