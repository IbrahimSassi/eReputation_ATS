'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
    'ATSApp.user',
    'ngResource',


])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/user');
}])
  .run(function ($rootScope, $state, UserService) {
    $rootScope.$on("$stateChangeStart", function (event, toState) {
      if (!toState.register ) {
        $rootScope.userpage = false;
        event.preventDefault();
      }

    });
  });
