/**
 * Created by MrFirases on 2/2/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp-front.user', [
      'ui.router',

    ])
    .config(config)
    .controller('UserCtrl', UserCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  UserCtrl.$inject = ['UserService', '$state','$rootScope','angularLoad','$location'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'angular/app/user/views/register.view.html',
        controller: 'UserCtrl as user',
        register:true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'angular/app/user/views/login.view.html',
        controller: 'UserCtrl as user',
        login:true
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
  function UserCtrl(UserService, $state,$rootScope,angularLoad,$location) {

    /**Scope Replace**/
    var vm = this;
    /***/

    $rootScope.userpage=true;
    vm.getAllUsers = function () {
      UserService.getAllUsers().then(function (data) {
        vm.users = data;
        console.log(vm.users);
      });
    };



    vm.credentialsRegister = {
      username : "",
      email : "",
      password : ""
    };

    vm.credentialsLogin = {
      email : "",
      password : ""
    };
    vm.onSubmitRegister = function () {
      console.log('Submitting registration'+vm.credentialsRegister.email);
      UserService
        .register(vm.credentialsRegister)
        .then(function(){
          alert('done');
        });
    };

    vm.onSubmitLogin = function () {
      UserService
        .login(vm.credentialsLogin)
        .then(function(){
          $location.path('register');
        });
    };




  };
  /**End UserCtrl Function**/

})();


