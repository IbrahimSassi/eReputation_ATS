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
    '$filter'
  ];


  /* @ngInject */
  function CreateChannelFN(ChannelService,
                           $state,
                           $stateParams,
                           $rootScope,
                           FacebookService,
                           $filter) {
    //On Init Start
    var vm = this;

    vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.title = 'Create Channel';
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
        console.log(vm.myChannels)
      })

    }


    vm.createChannel = function (form) {

      var itemByName = $filter('filter')(vm.myChannels, {name: vm.channel.name})[0];
      var itemByUrl = $filter('filter')(vm.myChannels, {url: vm.channel.url})[0];

      if (!form.$valid) {
        Materialize.toast("Fill all fields", 3000, "rounded");
        return;
      }

      console.log(itemByName)
      console.log(itemByUrl)
      if (itemByName && itemByName.name == vm.channel.name) {

        Materialize.toast("This name exists", 3000, "rounded");
        return;
      }

      if (itemByUrl && itemByUrl.url == vm.channel.url) {
        Materialize.toast("This url exists", 3000, "rounded");
        return;
      }


        ChannelService.addChannel(vm.channel)
          .then(function (result) {
            console.log("result", result);
            $state.go('channels');
            var $toastContent = $('<span class="green-text">New Channel has just created</span>');
            var rounded = "rounded"
            Materialize.toast($toastContent, 3000, rounded);
          });


    };

    vm.getPermissions = function () {
      console.log("getPermissions");
      FacebookService.initFacebookApi()
        .then(function (data) {
          console.log("here we are token  + user ,,promise bouh kalb", data);
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            console.log(newLongToken);
            vm.channel.accessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              vm.myFacebookPages.push({value: page.id, text: page.name})

              var $toastContent = $('<span class="green-text">Your permission has granted , now pick a page</span>');
              var rounded = "rounded"
              Materialize.toast($toastContent, 3000, rounded);

            });
          })

        });
    };


    vm.getSimalarChannels = function () {

      if (vm.gettedUrl != vm.channel.url) {
        vm.gettedUrl = vm.channel.url;
        if (vm.channel.url && vm.channel.url.length > 7 && (vm.channel.url.indexOf("http") > -1 || vm.channel.url.indexOf("www") > -1 )) {
          if (extractDomain(vm.channel.url).indexOf("undefined") <= -1 && extractDomain(vm.channel.url) != "http")
            console.log(extractDomain(vm.channel.url));
          ChannelService.getSimilarChannels(extractDomain(vm.channel.url)).then(function (data) {
            if (data.length) {
              console.log(data);
              vm.similarChannels = data;
            }

          })


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
