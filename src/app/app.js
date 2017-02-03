'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ngResource',
  'angularLoad',
  'ui.router'


])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/users');
  }])
  .run(function ($rootScope, $state, angularLoad) {


    angularLoad.loadScript('campaign/campaign.controller.js').then(function () {
      angularLoad.loadScript('assets/js/pages/wizard/widgets.min.js').then(function () {

        angularLoad.loadScript('campaign/campaign.service.js').then(function () {
        }).catch(function () {
          // There was some error loading the script. Meh
        });

      }).catch(function () {
        // There was some error loading the script. Meh
      });
    }).catch(function () {
      // There was some error loading the script. Meh
    });


    // angularLoad.loadScript('dashboard/dashboard.controller.js').then(function () {
    //       angularLoad.loadScript('dashboard/dashboard.factory.js').then(function () {
    //         angularLoad.loadScript('dashboard/dashboard.service.js').then(function () {
    //
    //
    //   }).catch(function () {
    //     // There was some error loading the script. Meh
    //   });
    // }).catch(function () {
    //   // There was some error loading the script. Meh
    // });
    // }).catch(function () {
    //   // There was some error loading the script. Meh
    // });


    $rootScope.$on("$stateChangeStart", function (event, toState) {
      if (!toState.dash) {
        $rootScope.dash = false;
        event.preventDefault();
      }

    });
  })

;
