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
    .module('ATSApp.profile', [
      'ui.router',

    ])
    .config(config)
    .controller('ProfileCtrl', ProfileCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  ProfileCtrl.$inject = ['ProfileService', '$state', '$rootScope', 'angularLoad', '$location'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'angular/app/user/views/profile.view.html',
        controller: 'ProfileCtrl as profile',
        register: true,
        authenticate: true

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
  function ProfileCtrl(ProfileService, $state, $rootScope, angularLoad, $location) {

    /**Scope Replace**/
    var vm = this;
    /***/
    vm.user = $rootScope.currentUser;


    /*
     vm.userDoc = {};
     ProfileService.getProfile().then(successCallback, errorCallback);
     function successCallback(response){
     vm.userDoc = response.data
     }
     function errorCallback(error){
     }
     */


    vm.logout = function () {
      ProfileService.logout();
      $location.path('login');
    };


  };
  /**End UserCtrl Function**/

})();


