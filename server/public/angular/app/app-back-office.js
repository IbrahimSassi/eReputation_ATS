'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ATSApp.channel',
  'ATSApp.facebook',
  'ngResource',
  'angularLoad',
  // 'ng-fusioncharts',
  'ui.router'


])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/test/charts');
  }]);
