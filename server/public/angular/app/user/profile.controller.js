/**
 * Created by MrFirases on 3/20/2017.
 */
/**
 * Created by MrFirases on 2/2/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp-front.profile', [
      'ui.router',

    ])
    .config(config)
    .controller('ProfileCtrl', ProfileCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  ProfileCtrl.$inject = ['meanData', '$state','$rootScope','angularLoad','$location','UserService'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'angular/app/user/views/profile.view.html',
        controller: 'ProfileCtrl as profile',
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
  function ProfileCtrl(meanData, $state,$rootScope,angularLoad,$location,UserService) {

    /**Scope Replace**/
    var vm = this;
    /***/

    vm.user = {};

    meanData.getProfile().then(successCallback, errorCallback);



    function successCallback(response){
      vm.user = response.data;
    }
    function errorCallback(error){
      //error code
    }



    vm.logout = function () {
      UserService.logout();
      $location.path('login');
    };


  };
  /**End UserCtrl Function**/

})();


