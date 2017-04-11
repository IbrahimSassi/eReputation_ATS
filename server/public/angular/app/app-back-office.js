'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.twitter',
  'ATSApp.campaign',
  'ATSApp.facebook',
  'ui.materialize',
  'ATSApp.channel',
  'ATSApp.profile',
  'ngResource',
  'angularLoad',
  'ui.router',
  'ATSApp.wwsa',

])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/campaign/list');


    }])
  .run(function ($rootScope, $state,$location, ProfileService,$window) {
    $rootScope.currentUser = ProfileService.currentUser();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      if (toState.authenticate && !ProfileService.isLoggedIn()){
        // User isn’t authenticated
        //$state.transitionTo("login");
        //event.preventDefault();
        $window.location.href = '/';
        console.log("Access denied!")
      }

      if (toState.shouldConfirmed && $rootScope.currentUser.state=='INACTIVE')
      {
        console.log('blocked')
        $window.location.href = '/admin';
      }

    });







    $rootScope.logOut = function()
    {
      ProfileService.logout();
      $window.location.href = '/#!/login';
    }

    $rootScope.goToProfile  = function()
    {
      $state.go('profile')
    }

    $rootScope.goToSettings  = function()
    {
      $state.go('settings')
    }


    if (ProfileService.isLoggedIn()) {


      console.log("Hey Brogrammers! This is the connected user: ",$rootScope.currentUser);
    }


   });
