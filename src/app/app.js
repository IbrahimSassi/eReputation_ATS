'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.home',
  'ATSApp.user',
    'ngResource',


])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/eReputation/users');
}]);
