'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp-front', [
  'ATSApp-front.user',
  'ngResource',
  'ui.router',
  'angularLoad'



]).config(['$urlRouterProvider', function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/register');
}]);