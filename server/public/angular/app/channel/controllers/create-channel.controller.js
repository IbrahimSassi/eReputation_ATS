/**
 * Created by Ibrahim on 20/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .controller('CreateChannelCtrl', CreateChannelFN);


  CreateChannelFN.$inject = [
    'ChannelService',
    '$state',
    '$stateParams',
    '$rootScope',
    'FacebookService',
    '$filter',
    'UtilsService'
  ];


  /* @ngInject */
  function CreateChannelFN(ChannelService,
                           $state,
                           $stateParams,
                           $rootScope,
                           FacebookService,
                           $filter,
                           UtilsService) {
    //On Init Start
    var vm = this;

    // vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.connectedUserId = $rootScope.currentUser._id;
    vm.channel = {
      name: "",
      url: "",
      type: "",
      accessToken: "",
      personal: false,
      userId: vm.connectedUserId
    };

    vm.myFacebookPages = [];
    vm.similarChannels = [];
    vm.gettedUrl = "";
    vm.myChannels = [];
    init();

    function init() {

      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (data) {
        vm.myChannels = data;
      });


    }


    vm.createChannel = function (form) {

      var itemByName = $filter('filter')(vm.myChannels, {name: vm.channel.name})[0];
      var itemByUrl = $filter('filter')(vm.myChannels, {url: vm.channel.url})[0];

      if (!form.$valid) {
        UtilsService.AlertToast("Fill all fields", "rounded", 3000);
        return;
      }

      if (itemByName && itemByName.name == vm.channel.name) {
        UtilsService.AlertToast("This name exists", "rounded", 3000);
        return;
      }

      if (itemByUrl && itemByUrl.url == vm.channel.url) {
        UtilsService.AlertToast("This url exists", "rounded", 3000);
        return;
      }


      ChannelService.addChannel(vm.channel)
        .then(function (result) {
          $state.go('channels');

          UtilsService.AlertToast(
            $('<span class="green-text">New Channel has just created</span>'), "rounded", 3000);

        })
        .catch(function () {
          UtilsService.AlertToast(
            $('<span class="red-text">There Was an error , please try again</span>'), "rounded", 3000);
        });


    };

    vm.getPermissions = function () {
      FacebookService.initFacebookApi()
        .then(function (data) {
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            vm.channel.accessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              vm.myFacebookPages.push({value: "https://www.facebook.com/" + page.id, text: page.name});

              UtilsService.AlertToast(
                $("<span class='red-text'>There Was an error , please refresh the page</span>"), "rounded", 3000)
              ;

            });
          })
            .catch(function (err) {
              console.log(err);
              UtilsService.AlertToast(
                $('<span class="red-text">There Was an error , please refresh the page</span>'), "rounded", 3000);
            });


        });
    };


    vm.getSimalarChannels = function () {

      if (vm.gettedUrl != vm.channel.url) {
        vm.gettedUrl = vm.channel.url;
        if (vm.channel.url && vm.channel.url.length > 7 && (vm.channel.url.indexOf("http") > -1 || vm.channel.url.indexOf("www") > -1 )) {
          if (extractDomain(vm.channel.url).indexOf("undefined") <= -1 && extractDomain(vm.channel.url) != "http")
            ChannelService.getSimilarChannels(extractDomain(vm.channel.url))
              .then(function (data) {
                if (data.length) {
                  vm.similarChannels = data;
                }
              })
              .catch(function () {
              });


        }
      }

    };


    function extractDomain(url) {
      var domain;
      //find & remove protocol (http, ftp, etc.) and get domain
      if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
        if ((domain.split('.')[1] || domain.split('.')[2] ) && domain.indexOf('www') > -1) {
          domain = domain.split('.')[1] + "." + domain.split('.')[2];
        }
        else {
          domain = domain.split('.')[0] + "." + domain.split('.')[1];
        }
      }
      else {
        domain = url.split('/')[0];
      }
      //find & remove port number
      domain = domain.split(':')[0];

      return domain;
    }


  }

})();
