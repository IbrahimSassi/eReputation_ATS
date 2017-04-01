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

  LoginCtrl.$inject = ['UserService', '$state','$rootScope','angularLoad','$location','$window'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'angular/app/user/views/login.view.html',
        controller: 'LoginCtrl as user',
        login:true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  /** Controller UseCtrl FUNCTION
   */
  function LoginCtrl(UserService, $state,$rootScope,angularLoad,$location,$window) {

    /**Scope Replace**/
    var vm = this;
    /***/

    vm.errorInvalid = false;
    vm.errorInactive = false;

    vm.credentialsLogin = {
      email : "",
      password : ""
    };

    vm.onSubmitLogin = function () {
      UserService
        .login(vm.credentialsLogin)
        .then(successCallback, errorCallback);



      function successCallback(response){
        console.log("succ",response)
        vm.errorInvalid = false;
        UserService.saveToken(response.token);
        $window.location.href = '/admin';
      }
      function errorCallback(error){
        //alert(error.status)
        console.log("error",error)
        if (error.status ==400)
        {
          vm.errorInactive = true;
        }
        else if (error.status ==401)
          vm.errorInvalid = true;
      }
    };
    vm.goToRegister = function () {
      $location.path('register');
    };

  };
  /**End UserCtrl Function**/

})();

