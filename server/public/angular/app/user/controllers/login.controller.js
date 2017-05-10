/**
 * Created by MrFirases on 3/23/2017.
 */
(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp-front.user', [
      'ui.router',

    ])
    .config(config)
    .controller('LoginCtrl', LoginCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  LoginCtrl.$inject = ['UserService', '$state', '$rootScope', 'angularLoad', '$location', '$window', '$stateParams'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'angular/app/user/views/login.view.html',
        controller: 'LoginCtrl as user',
        login: true
      })

      .state('forgotPasswordRequest', {
        url: '/recover',
        templateUrl: 'angular/app/user/views/forgotPasswordRequest.view.html',
        controller: 'LoginCtrl as recover',
        login: true
      })

      .state('changePassword', {
        url: '/changePassword/:token',
        templateUrl: 'angular/app/user/views/changePassword.view.html',
        controller: 'LoginCtrl as recover',
        login: true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  /** Controller UseCtrl FUNCTION
   */
  function LoginCtrl(UserService, $state, $rootScope, angularLoad, $location, $window, $stateParams) {

    /**Scope Replace**/
    var vm = this;
    /***/

    vm.errorInvalid = false;
    vm.errorInactive = false;

    vm.credentialsLogin = {
      email: "",
      password: ""
    };

    vm.onSubmitLogin = function () {
      UserService
        .login(vm.credentialsLogin)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        vm.errorInvalid = false;
        UserService.saveToken(response.token);
        $window.location.href = '/admin';
      }

      function errorCallback(error) {
        if (error.status == 400) {
          vm.errorInactive = true;
        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };
    vm.goToRegister = function () {
      $location.path('register');
    };


    /*
     For forget password
     */
    vm.forgotPasswordRequestBtn = function () {


      UserService
        .requestNewPassword(vm.requestedEmail)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        swal("Success!", "An Email Was Sent To You!", "success");
      }

      function errorCallback(error) {
        swal("Error! Please verify your Email");
      }
    }

    vm.changePasswordBtn = function () {
      if (vm.passwordChange == vm.passwordChangeAgain) {
        ChangePass();
      }
      else {
        swal("Error! Please Verify Your Password");
      }
    }

    function ChangePass() {


      vm.change = {
        token: $stateParams.token,
        password: vm.passwordChange
      };

      UserService
        .changePassword(vm.change)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        swal("Success!", "Password Changed!", "success")
      }

      function errorCallback(error) {
        swal("Error In Changing Password!")
      }
    }

    /*
     End for forget password
     */


  };
  /**End UserCtrl Function**/

})();


