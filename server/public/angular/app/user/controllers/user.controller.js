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

  UserCtrl.$inject = ['UserService', '$state', '$rootScope', 'angularLoad', '$location'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'angular/app/user/views/register.view.html',
        controller: 'UserCtrl as user',
        register: true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'angular/app/user/views/login.view.html',
        controller: 'UserCtrl as user',
        login: true
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
  function UserCtrl(UserService, $state, $rootScope, angularLoad, $location) {

    /**Scope Replace**/
    var vm = this;
    /***/

    $rootScope.userpage = true;
    vm.getAllUsers = function () {
      UserService.getAllUsers().then(function (data) {
        vm.users = data;
        console.log(vm.users);
      });
    };

    vm.clearcredentialsRegister = function () {

      vm.credentialsRegister = {
        username: "",
        email: "",
        password: "",

        firstName: "",
        lastName: "",
        passwordAgain: "",
        businessName: "",
        employeesNumber: "",
        businessType: "",
        accountType: ""
      };

    };
    vm.setIndividual = function () {
      vm.credentialsRegister.accountType = "individual"
    };
    vm.setBusiness = function () {
      vm.credentialsRegister.accountType = "business"
    };
    vm.credentialsRegister = {
      username: "",
      email: "",
      password: "",

      firstName: "",
      lastName: "",
      passwordAgain: "",
      businessName: "",
      employeesNumber: "",
      businessType: "",
      accountType: "individual"
    };

    vm.credentialsLogin = {
      email: "",
      password: ""
    };
    vm.onSubmitRegister = function () {
      console.log('Email: ' + vm.credentialsRegister.email);
      console.log('FirstName: ' + vm.credentialsRegister.firstName);
      console.log('lastName: ' + vm.credentialsRegister.lastName);
      console.log('username: ' + vm.credentialsRegister.username);
      console.log('password: ' + vm.credentialsRegister.password);
      console.log('passwordAgain: ' + vm.credentialsRegister.passwordAgain);
      console.log('businessName: ' + vm.credentialsRegister.businessName);
      console.log('employeesNumber: ' + vm.credentialsRegister.employeesNumber);
      console.log('businessType: ' + vm.credentialsRegister.businessType);
      console.log('accountType: ' + vm.credentialsRegister.accountType);

      UserService
        .register(vm.credentialsRegister)
        .then(function () {
        });
    };

    vm.onSubmitLogin = function () {
      UserService
        .login(vm.credentialsLogin)
        .then(function () {
          $location.path('profile');
        });
    };

    vm.goToRegister = function () {
      $location.path('register');
    };
    vm.goToLogin = function () {
      $location.path('login');
    };


  };
  /**End UserCtrl Function**/

})();


