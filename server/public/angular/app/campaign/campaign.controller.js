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

  CampaignCtrlFN.$inject = ['$scope', '$state', '$rootScope', '$ocLazyLoad', 'angularLoad'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('campaignCreate', {
        url: '/campaign/create',
        templateUrl: 'angular/app/campaign/views/campaign.view.html',
        controller: 'CampaignCtrl as vm'
        // comp:true
      })
      .state('channelCreate', {
        url: '/channel/create',
        templateUrl: 'angular/app/campaign/views/channel.view.html',
        controller: 'CampaignCtrl as vm'
        // comp:true
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  function CampaignCtrlFN($scope, $state, $rootScope, $ocLazyLoad, angularLoad) {
    var vm = this;

    vm.OPTIONS = [['aaaa', 1], ['aaab', 2], ['aabb', 3], ['abbb', 4],
      ['bbbb', 5], ['hello world', 6], ['this is a test', 7]];

    /**Scope Replace**/


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
      },
      {
        link: "mosaiquefm.net/",
        src: "others"
      }

    ];

    vm.newChannel = {
      link: 'facebook.com/test',
      src: 'face'
    };


    vm.addChannel = function () {

      console.log("called");
      console.log(vm.newChannel)
      if (vm.newChannel.link.indexOf("facebook") !== -1) {
        vm.newChannel.src = "facebook";
      }
      else if (vm.newChannel.link.indexOf("google") !== -1) {
        vm.newChannel.src = "google+";
      }
      else if (vm.newChannel.link.indexOf("twitter") !== -1)
        vm.newChannel.src = "twitter";


      vm.channels.push(vm.newChannel);

      console.log(vm.channels);
      // vm.newChannel.link = "";

      // $scope.$apply();

    }


    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/material-preloader/js/materialPreloader.min.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/jquery-blockui/jquery.blockui.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/jquery-validation/jquery.validate.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/jquery-steps/jquery.steps.min.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/sugar.min.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/widgets.min.js');
    // $ocLazyLoad.load('angular/app/assets/js/pages/wizard/form-wizard.js');

    /** Scripts Loading first Refresh **/
    angularLoad.loadScript('angular/app/assets/js/pages/wizard/material-preloader/js/materialPreloader.min.js').then(function () {
      angularLoad.loadScript('angular/app/assets/js/pages/wizard/jquery-blockui/jquery.blockui.js').then(function () {
        angularLoad.loadScript('angular/app/assets/js/pages/wizard/jquery-validation/jquery.validate.js').then(function () {
          angularLoad.loadScript('angular/app/assets/js/pages/wizard/jquery-steps/jquery.steps.min.js').then(function () {
            angularLoad.loadScript('angular/app/assets/js/pages/wizard/sugar.min.js').then(function () {
              angularLoad.loadScript('angular/app/assets/js/pages/wizard/widgets.min.js').then(function () {
                angularLoad.loadScript('angular/app/assets/js/plugins/perfect-scrollbar/perfect-scrollbar.min.js').then(function () {
                  angularLoad.loadScript('angular/app/assets/js/pages/wizard/form-wizard.js').then(function () {
                      console.log("scripts load succefully")
                  })
                    .catch(function () {
                      console.log('err script 3');
                    });

                })
                  .catch(function () {
                    console.log('err script 3');
                  });

              })
                .catch(function () {
                  console.log('err script 3');
                });

            })
              .catch(function () {
                console.log('err script 3');
              });

          })
            .catch(function () {
              console.log('err script 3');
            });

        })
          .catch(function () {
            console.log('err script 3');
          });
      })
        .catch(function () {
          console.log('err script 2');
        });
    }).catch(function () {
      console.log('err script 1');
    });
    /** END of Scripts Loading first Refresh **/


    /***/


  };


})();


