'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.twitter',
  'ATSApp.campaign',
  'ATSApp.facebook',
  'ATSApp.websites',
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
      $urlRouterProvider.otherwise('/profile');


    }])
  .run(function ($rootScope, $state,$location, ProfileService,CampaignService,$window) {

    $rootScope.currentUser = ProfileService.currentUser();

    $rootScope.disabled = $rootScope.currentUser.state =='INACTIVE' ? true:false;
    /***
     *
     */

    CampaignService.getAllCampaigns().then(function (data) {
      var allMainCampaigns=[];
      data.forEach(function (campaign,index) {
        if($rootScope.currentUser._id===campaign.userId)
        {
          allMainCampaigns.push(campaign);
        }

        if(index==data.length-1)
        {
          $rootScope.currentUser.numberOfCampaigns =allMainCampaigns.length;
          $rootScope.currentUser.lastOneCreated =  allMainCampaigns[allMainCampaigns.length-1].dateCreation;
        }

      })

    });


    /**
     *
     *
     */


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

     if ($window.location.href == '/' && !ProfileService.isLoggedIn())

      {
        $window.location.href = '/';

      }


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




    if (ProfileService.isLoggedIn()) {


      console.log("Hey Brogrammers! This is the connected user: ",$rootScope.currentUser);
    }


   });
