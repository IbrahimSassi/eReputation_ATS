'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
  'ATSApp.dashboard',
  'ATSApp.campaign',
  'ATSApp.channel',
  'ATSApp.facebook',
  'ngResource',
  'angularLoad',
  'ui.materialize',
  // 'ng-fusioncharts',
  'ui.router'


])
  .config(['$urlRouterProvider',
    function ($urlRouterProvider) {
      $urlRouterProvider.otherwise('/users');


    }]);
