/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.channel', [
      'ui.router',
      // 'ui.materialize',
      'ATSApp.facebook',
      //TODO
      // 'angular-loading-bar'
      // 'ngAnimate',
      // 'ngTouch'
    ])
    .config(config)
    .controller('ChannelCtrl', ChannelCtrl);


  config.$inject = ['$stateProvider', '$urlRouterProvider'];
  ChannelCtrl.$inject = [
    'ChannelService',
    '$state',
    '$stateParams',
    '$scope',
    '$rootScope'
  ];


  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('channels', {
        url: '/channels/all',
        templateUrl: 'angular/app/channel/views/manage-channels.view.html',
        controller: 'ChannelCtrl as vm',
        cache: false,
        authenticate: true
      })
      .state('channel-detail', {
        url: '/channels/detail/:channelId',
        templateUrl: 'angular/app/channel/views/channel-detail.view.html',
        controller: 'DetailChannel as vm',
        cache: false,
        authenticate: true
      })
      .state('newChannel', {
        url: '/channels/new',
        templateUrl: 'angular/app/channel/views/create-channel.view.html',
        controller: 'CreateChannelCtrl as vm',
        authenticate: true
      })
      .state("otherwise", {url: '/channels/all'})
    ;

  }

  /* @ngInject */
  function ChannelCtrl(ChannelService,
                       $state,
                       $stateParams,
                       $scope,
                       $rootScope) {
    //On Init Start
    var vm = this;
    vm.myChannels = [];
    vm.connectedUserId = $rootScope.currentUser._id;
    // vm.connectedUserId = "58d3dc815d391346a06f48c3";

    init();


    function init() {
      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (data) {
        vm.myChannels = data;
      })
    }

    vm.deleteChannel = function (channel) {
      ChannelService.deleteChannel(channel).then(function () {
        init();
      })
    }


  }

})();
