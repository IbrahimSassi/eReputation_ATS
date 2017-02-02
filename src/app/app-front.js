'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp-front', [
  'ATSApp-front.user',
  'ngResource',
  'ui.router',



]).config(['$urlRouterProvider', function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
}]);
