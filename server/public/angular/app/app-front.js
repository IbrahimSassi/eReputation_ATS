'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp-front', [
  'ATSApp-front.user',
  'ngResource',
  'ui.router',
  'angularLoad'


]).config(['$urlRouterProvider', function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/register');
}])
  .run(function ($rootScope, $state, $location, UserService, $window) {


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {


      if (UserService.isLoggedIn() && (toState.login || toState.register)) {
        $window.location.href = '/admin';
      }


    });


  });
