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

  RegisterCtrl.$inject = ['UserService', '$state','$rootScope','angularLoad','$location','$window'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'angular/app/user/views/register.view.html',
        controller: 'RegisterCtrl as user',
        register:true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };

  function RegisterCtrl(UserService, $state,$rootScope,angularLoad,$location,$window) {

    /**Scope Replace**/
    var vm = this;
    /***/

    vm.emailExists = false;
    vm.AllFieldsRequired = false;
    vm.clearcredentialsRegister = function () {

      vm.credentialsRegister = {
        username : "",
        email : "",
        password : "",

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
    vm.setBusiness= function () {
      vm.credentialsRegister.accountType = "business"
    };
    vm.credentialsRegister = {
      username : "",
      email : "",
      password : "",

      firstName: "",
      lastName: "",
      passwordAgain: "",
      businessName: "",
      employeesNumber: "",
      businessType: "",
      accountType: "individual"
    };


    vm.onSubmitRegister = function () {
      console.log('Email: '+vm.credentialsRegister.email);
      console.log('FirstName: '+vm.credentialsRegister.firstName);
      console.log('lastName: '+vm.credentialsRegister.lastName);
      console.log('username: '+vm.credentialsRegister.username);
      console.log('password: '+vm.credentialsRegister.password);
      console.log('passwordAgain: '+vm.credentialsRegister.passwordAgain);
      console.log('businessName: '+vm.credentialsRegister.businessName);
      console.log('employeesNumber: '+vm.credentialsRegister.employeesNumber);
      console.log('businessType: '+vm.credentialsRegister.businessType);
      console.log('accountType: '+vm.credentialsRegister.accountType);

      UserService
        .register(vm.credentialsRegister)
        .then(successCallback, errorCallback);



      function successCallback(response){
        console.log("succ",response)
        UserService.saveToken(response.token);
        $window.location.href = '/admin';
        console.log(response)
      }
      function errorCallback(error){
        console.log("error",error)
        if(error.status==401)
        {
        vm.emailExists = true;
        }
        else
          vm.AllFieldsRequired = true;
      }
    };

    vm.goToLogin = function () {
      $location.path('login');
    };


  };
  /**End UserCtrl Function**/

})();


