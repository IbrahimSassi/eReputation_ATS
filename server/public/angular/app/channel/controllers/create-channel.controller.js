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
    'FacebookService'
  ];


  /* @ngInject */
  function CreateChannelFN(ChannelService,
                           $state,
                           $stateParams,
                           $rootScope,
                           FacebookService) {
    //On Init Start
    var vm = this;

    vm.connectedUserId = "58cee43b68af191fec669521";
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
    init();

    function init() {

    }


    vm.createChannel = function (form) {

      if (form) {
        ChannelService.addChannel(vm.channel)
          .then(function (result) {
            console.log("result", result);
            $state.go('channels');
            var $toastContent = $('<span class="green-text">New Channel has just created</span>');
            var rounded = "rounded"
            Materialize.toast($toastContent, 3000, rounded);
          });
      }

    };

    vm.getPermissions = function () {
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
      if (vm.channel.url && vm.channel.url.length > 7 && (vm.channel.url.indexOf("http") > -1 || vm.channel.url.indexOf("www") > -1 )) {
        console.log("get called");
        if (extractDomain(vm.channel.url).indexOf("undefined") <= -1 && extractDomain(vm.channel.url) != "http")
          console.log(extractDomain(vm.channel.url));
          ChannelService.getSimilarChannels(extractDomain(vm.channel.url)).then(function (data) {
            if(data.length)
            {
              console.log(data);
              vm.similarChannels = data;
            }

          })


      }
    }


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
