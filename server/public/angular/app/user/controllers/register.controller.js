/**
 * Created by MrFirases on 3/23/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp-front.user')
    .config(config)
    .controller('RegisterCtrl', RegisterCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  RegisterCtrl.$inject = ['UserService', '$state', '$rootScope', 'angularLoad', '$location', '$window'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'angular/app/user/views/register.view.html',
        controller: 'RegisterCtrl as user',
        register: true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };

  function RegisterCtrl(UserService, $state, $rootScope, angularLoad, $location, $window) {

    /**Scope Replace**/
    var vm = this;
    /***/

    vm.emailExists = false;
    vm.AllFieldsRequired = false;
    vm.usernameEx = false;
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


    vm.onSubmitRegister = function () {

      if ((vm.credentialsRegister.username.length < 5 && vm.credentialsRegister.businessName.length < 5) || vm.credentialsRegister.password.length < 6 || (vm.credentialsRegister.password != vm.credentialsRegister.passwordAgain)
      ) {
      }


      else {
        register();
      }

    };


    function register() {
      UserService
        .register(vm.credentialsRegister)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        //swal("Your account was successfully created!", "We sent you an email! Please confirm your registration", "success");
        UserService.saveToken(response.token);
        $window.location.href = '/admin';
        UserService.SendVerificationEmail(vm.credentialsRegister.email).then(function (data) {
        })
      }

      function errorCallback(error) {
        if (error.status == 401) {
          vm.emailExists = true;
        }
        else if (error.status == 403) {
          vm.usernameEx = true;
        }
        else
          vm.AllFieldsRequired = true;
      }
    }

    vm.goToLogin = function () {
      $location.path('login');
    };


  };
  /**End UserCtrl Function**/

})();


