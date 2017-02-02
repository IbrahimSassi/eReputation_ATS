'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.user',
  'ATSApp.campaign',
  'ngResource',
  'angularLoad',
  'ui.router'


])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/users');
  }])
  .run(function ($rootScope, $state, angularLoad) {


    angularLoad.loadScript('assets/js/plugins/jquery-1.11.2.min.js').then(function () {
      angularLoad.loadScript('assets/js/pages/wizard/material-preloader/js/materialPreloader.min.js').then(function () {
        angularLoad.loadScript('assets/js/pages/wizard/jquery-blockui/jquery.blockui.js').then(function () {
          angularLoad.loadScript('assets/js/pages/wizard/jquery-validation/jquery.validate.min.js').then(function () {
            angularLoad.loadScript('assets/js/pages/wizard/jquery-steps/jquery.steps.min.js').then(function () {
                angularLoad.loadScript('assets/js/materialize.min.js').then(function () {
                  angularLoad.loadScript('assets/js/pages/wizard/form-wizard.js').then(function () {

                    console.log("c bn")
                  }).catch(function () {
                    // There was some error loading the script. Meh
                  });

                }).catch(function () {
                  // There was some error loading the script. Meh
                });

            }).catch(function () {
              // There was some error loading the script. Meh
            });
          }).catch(function () {
            // There was some error loading the script. Meh
          });
        }).catch(function () {
          // There was some error loading the script. Meh
        });
      }).catch(function () {
        // There was some error loading the script. Meh
      });
    }).catch(function () {
      // There was some error loading the script. Meh
    });


    $rootScope.$on("$stateChangeStart", function (event, toState) {
      // if (!toState.comp) {
      //   $rootScope.comp = false;
      //   $rootScope.compo = false;
      //   event.preventDefault();
      // }

    });
  })

;
