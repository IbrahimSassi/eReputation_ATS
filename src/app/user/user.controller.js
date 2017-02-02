/**
 * Created by MrFirases on 2/2/2017.
 */

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

  UserCtrl.$inject = ['UserService', '$state','$rootScope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'user/views/register.view.html',
        controller: 'UserCtrl as user',
        register:true
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
  function UserCtrl(UserService, $state,$rootScope) {

    /**Scope Replace**/
    var vm = this;
    /***/
    $rootScope.userpage=true;
    vm.getAllUsers = function () {
      UserService.getAllUsers().then(function (data) {
        vm.users = data;
        console.log(vm.users);
      });

    }


  };

  /**End UserCtrl Function**/

})();


