(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.dashboard', [
      'ui.router',

    ])
    .config(config)
    .controller('DashboardCtrl', DashboardCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  DashboardCtrl.$inject = ['DashboardService', '$state', 'angularLoad','$scope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'angular/app/dashboard/views/main.dashboard.view.html',
        controller: 'DashboardCtrl as dash',
        dash: true
      })


    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/


  function DashboardCtrl(DashboardService, $state, angularLoad,$scope) {

    /**Scope Replace**/
    var vm = this;


    vm.getAllUsers = function () {
      DashboardService.getAllUsers().then(function (data) {
        vm.users = data;
        console.log(vm.users);
      });

    };



    /** Scripts Loading first Refresh **/
    angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
        angularLoad.loadScript('angular/app/assets/js/charts/narimen/columnchart.js').then(function () {

        }).catch(function () {
          console.log('err script 1');
        });
    }).catch(function () {
      console.log('err script 1');
    });
    /** END of Scripts Loading first Refresh **/

  };

  /**End UserCtrl Function**/

})();


