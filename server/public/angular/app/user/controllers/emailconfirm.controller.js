/**
 * Created by MrFirases on 3/30/2017.
 */

(function () {
  'use strict';


  angular
    .module('ATSApp-front.user')
    .config(config)
    .controller('EmailConfirmCtrl', EmailConfirmCtrl);


  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  EmailConfirmCtrl.$inject = ['EmailConfirmService', '$state', '$rootScope', 'angularLoad', '$location', '$window', '$stateParams','UserService'];

  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('emailConfirm', {
        url: '/emailconfirmation/:token',
        templateUrl: 'angular/app/user/views/emailconfirm.view.html',
        controller: 'EmailConfirmCtrl as EmailConfirmCtrl',
        login: true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };
  /**End of Route Config**/

  /** Controller UseCtrl FUNCTION
   */
  function EmailConfirmCtrl(EmailConfirmService, $state, $rootScope, angularLoad, $location, $window, $stateParams,UserService) {


    var vm = this;
    /***/

    vm.success = false;
    vm.echec = false;

    var token = $stateParams.token
    EmailConfirmService.CheckToken(token).then(successCallback, errorCallback);

    function successCallback(response) {
      vm.success = true;
      UserService.saveToken(response.token);
      setTimeout(function(){ $window.location.href = '/admin'; }, 1000);


    }

    function errorCallback(error) {
      vm.echec = true;
    }

  };


})();


