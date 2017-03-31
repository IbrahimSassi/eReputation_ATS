/**
 * Created by MrFirases on 4/1/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.profile')
    .service('SettingsService', SettingsService);

  SettingsService.$inject = ['$http','$window'];


  function SettingsService($http,$window) {




    return {


    };



  }


})();

