/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.channel', [
      'ui.router'
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
    '$scope'
  ];


  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('channels', {
        url: '/channels/all',
        templateUrl: 'angular/app/channel/views/manage-channels.view.html',
        controller: 'ChannelCtrl as channel',
        cache: false
      })
    // .state('channel-detail', {
    //   url: '/channels/detail/:channelId',
    //   templateUrl: 'angular/app/channel/views/channel-detail.view.html',
    //   controller: 'DetailChannel as channel',
    //   cache: false
    // })
    // .state('newChannel', {
    //   url: '/channels/new',
    //   templateUrl: 'angular/app/channel/views/create-channel.html',
    //   controller: 'CreateChannelCtrl as channelCreate'
    // })
      .state("otherwise", { url : '/channels/all'})

    ;

  };

  /* @ngInject */
  function ChannelCtrl(ChannelService,
                     $state,
                     $stateParams,
                     $scope) {
    //On Init Start
    var vm = this;
    vm.title = 'Channel List';

  };

})();
