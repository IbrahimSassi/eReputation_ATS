'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ATSApp.channel',
  'ATSApp.profile',
  'ngResource',
  'angularLoad',
  'ui.router'


])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/users');


    }])
  .run(function ($rootScope, $state,$location, ProfileService,$window) {

    $rootScope.logOut= function()
    {
      ProfileService.logout();
      $window.location.href = '/#!/login';
    }

    if (ProfileService.isLoggedIn()) {

      $rootScope.currentUser = ProfileService.currentUser();
      console.log("Hey Brogrammers! This is the connected user: ",$rootScope.currentUser);
    }
    else {
      //$state.go('login');
    }});
