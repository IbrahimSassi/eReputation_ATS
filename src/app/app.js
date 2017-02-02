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

    $rootScope.$on("$stateChangeStart", function (event, toState) {
      // if (!toState.comp) {
      //   $rootScope.comp = false;
      //   $rootScope.compo = false;
      //   event.preventDefault();
      // }

    });
  })

;
