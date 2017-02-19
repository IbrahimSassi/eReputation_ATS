'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ngResource',
  'angularLoad',
  'ui.router'


])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/users');
  }]);
