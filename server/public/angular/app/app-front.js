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
  .run(function ($rootScope, $state,$location, UserService,$window) {



/*

    $rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
      console.log("location: ")
      if (UserService.isLoggedIn() && ($location.path('/login').$$path == 'login' || $location.path('/register').$$path == 'register')) {
        $window.location.href = '/admin';
      }

    });
*/


  });
