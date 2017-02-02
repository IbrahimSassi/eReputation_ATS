(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign', [
      'oc.lazyLoad'
    ])
    .config(config)
    .controller('CampaignCtrl', CampaignCtrlFN);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  CampaignCtrlFN.$inject = ['$scope', '$state', '$rootScope', '$ocLazyLoad'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('campaignCreate', {
        url: '/campaign/create',
        templateUrl: 'campaign/views/campaign.view.html',
        controller: 'CampaignCtrl as vm'
        // comp:true
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  function CampaignCtrlFN($scope, $state, $rootScope, $ocLazyLoad) {

    /**Scope Replace**/
    var vm = this;
    $ocLazyLoad.load('../../assets/js/pages/wizard/material-preloader/js/materialPreloader.min.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/jquery-blockui/jquery.blockui.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/jquery-validation/jquery.validate.min.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/jquery-steps/jquery.steps.min.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/form-wizard.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/sugar.min.js');
    $ocLazyLoad.load('../../assets/js/pages/wizard/widgets.min.js');


    vm.OPTIONS = [['aaaa', 1], ['aaab', 2], ['aabb', 3], ['abbb', 4],
      ['bbbb', 5], ['hello world', 6], ['this is a test', 7]];


    vm.channels = [
      {
        link: "https://www.facebook.com/apple/",
        src: "facebook"
      },
      {
        link: "https://twitter.com/apple/",
        src: "twitter"
      },
      {
        link: "https://plus.google.com/apple/",
        src: "google+"
      }
    ];

    vm.newChannel = {
      link: '',
      src: ''
    }

    vm.addChannel = function () {

      console.log("called");

      // if (vm.newChannel.link.indexOf("facebook") !== -1) {
      //   vm.newChannel.src = "facebook";
      // }
      // else if (vm.newChannel.link.indexOf("google") !== -1) {
      //   vm.newChannel.src = "google+";
      // }
      // else if (vm.newChannel.link.indexOf("twitter") !== -1)
      //   vm.newChannel.src = "twitter";
      //
      // console.log(vm.newChannel);
      // vm.channels.push(vm.newChannel);
      // vm.newChannel = null;

    }


    // $rootScope.comp=true;
    //
    // if($rootScope.comp==true)
    //   $rootScope.compo=true;


    /***/


  };


})();


