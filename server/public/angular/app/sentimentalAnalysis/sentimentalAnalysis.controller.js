/**
 * Created by ninou on 3/29/2017.
 */



(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.wwsa', [
      'ui.router',

    ])
    .config(config)
    .controller('WwsaCtrl', WwsaCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$qProvider'];

  WwsaCtrl.$inject = ['WwsaService', '$state', 'angularLoad', '$scope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $qProvider) {

    $stateProvider
      .state('sentimental', {
        url: '/Wwsa',
        templateUrl: '../angular/app/sentimentalAnalysis/views/sentimentalAnalysis.view.html',
        controller: 'WwsaCtrl as sentimental'
      })



    ;
    $qProvider.errorOnUnhandledRejections(false);


  }
  /**End of Route Config**/


  function WwsaCtrl(WwsaService, $state, angularLoad, $scope) {



  };

  /**End UserCtrl Function**/

})();


