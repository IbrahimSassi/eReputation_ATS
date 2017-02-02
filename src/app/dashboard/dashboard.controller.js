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

  DashboardCtrl.$inject = ['DashboardService', '$state'];
    /**End Of Injection**/


    /** Route Config **/
    function config($stateProvider, $urlRouterProvider, $qProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/views/main.dashboard.view.html',
                controller: 'DashboardCtrl as dash',
            })


        ;
        $qProvider.errorOnUnhandledRejections(false);


    };
    /**End of Route Config**/


    function DashboardCtrl(DashboardService, $state) {

        /**Scope Replace**/
        var vm = this;
        /***/

        vm.getAllUsers = function () {
          DashboardService.getAllUsers().then(function (data) {
                vm.users = data;
                console.log(vm.users);
            });

        }


    };

    /**End UserCtrl Function**/

})();


