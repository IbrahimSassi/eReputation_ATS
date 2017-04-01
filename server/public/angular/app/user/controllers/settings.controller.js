/**
 * Created by MrFirases on 4/1/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.profile')
    .config(config)
    .controller('SettingsCtrl', SettingsCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  SettingsCtrl.$inject = ['$state','$rootScope','angularLoad','$location'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'angular/app/user/views/settings.view.html',
        controller: 'SettingsCtrl as settings',
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
  function SettingsCtrl($state,$rootScope,angularLoad,$location) {

    /**Scope Replace**/
    var vm = this;
    /***/


  };
  /**End UserCtrl Function**/

})();

