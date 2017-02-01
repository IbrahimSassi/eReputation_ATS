(function () {
    'use strict';

    /**My Module init**/
    angular
        .module('ATSApp.user', [
            'ui.router',

        ])
        .config(config)
        .controller('UserCtrl', UserCtrl);

    /**End My Module Init**/

    /**Injection**/
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

    UserCtrl.$inject = ['UserService', '$state'];
    /**End Of Injection**/


    /** Route Config **/
    function config($stateProvider, $urlRouterProvider, $qProvider) {

        $stateProvider
            .state('listUsers', {
                url: '/users',
                templateUrl: 'user/views/list.user.view.html',
                controller: 'UserCtrl as user',
            })


        ;
        $qProvider.errorOnUnhandledRejections(false);


    };
    /**End of Route Config**/

    /** Controller UseCtrl FUNCTION
     *
     * @param UserService
     * @param $state
     */
    function UserCtrl(UserService, $state) {

        /**Scope Replace**/
        var vm = this;
        /***/

        vm.getAllUsers = function () {
            UserService.getAllUsers().then(function (data) {
                vm.users = data;
                console.log(vm.users);
            });

        }


    };

    /**End UserCtrl Function**/

})();


