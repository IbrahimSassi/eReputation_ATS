'use strict';

// Declare app level module which depends on views, and components
angular.module('ATSApp', [
    'ATSApp.dashboard',
    'ngResource',
    'ui.router',



]).config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');
}]);
