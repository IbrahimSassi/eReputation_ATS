'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ATSApp.facebook',
  'ui.materialize',
  'ATSApp.channel',
  'ATSApp.profile',
  'ngResource',
  'angularLoad',
  'ui.router',
  'ATSApp.wwsa'


])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/users');


    }])
  .run(function ($rootScope, $state,$location, ProfileService,$window) {

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

      $rootScope.currentUser = ProfileService.currentUser();
      console.log("Hey Brogrammers! This is the connected user: ",$rootScope.currentUser);
    }
    else {
      //$state.go('login');
    }});
