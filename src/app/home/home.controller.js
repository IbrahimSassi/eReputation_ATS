/**
 * Created by Ibrahim on 31/01/2017.
 */
(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.home', [
      'ui.router',

    ])
    .config(config)
    .controller('HomeCtrl', HomeCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  HomeCtrl.$inject = ['$state'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('eReputation', {
        url: '/eReputation',
        templateUrl: 'home/home.view.html',
        controller: 'HomeCtrl as vm',
      })

  };
  /**End of Route Config**/

  /** Controller HomeCtrl FUNCTION
   *
   * @param $state
   */
  function HomeCtrl($state) {

    /**Scope Replace**/
    var vm = this;
    /***/



  };

  /**End HomeCtrl Function**/

})();


