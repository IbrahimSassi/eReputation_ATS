(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.dashboard', [
      'ui.router',
      'oc.lazyLoad'

    ])
    .config(config)
    .controller('DashboardCtrl', DashboardCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  DashboardCtrl.$inject = ['DashboardService', '$state', '$ocLazyLoad','$rootScope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'dashboard/views/main.dashboard.view.html',
        controller: 'DashboardCtrl as dash',
        dash: true
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/


  function DashboardCtrl(DashboardService, $state, $ocLazyLoad,$rootScope) {

    /**Scope Replace**/
    var vm = this;
    /***/
    $rootScope.dash = true;
    $ocLazyLoad.load('https://code.highcharts.com/highcharts.js');
    $ocLazyLoad.load('https://code.highcharts.com/highcharts-more.js');
    $ocLazyLoad.load('https://code.highcharts.com/modules/exporting.js');
    $ocLazyLoad.load('../../assets/js/highcharts.js');

    vm.getAllUsers = function () {
      DashboardService.getAllUsers().then(function (data) {
        vm.users = data;
        console.log(vm.users);
      });

    }


  };

  /**End UserCtrl Function**/

})();


