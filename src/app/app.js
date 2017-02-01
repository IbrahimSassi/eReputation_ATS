'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
    'ATSApp.user',
    'ngResource',


])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/users');
}]);
