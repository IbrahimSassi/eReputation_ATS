/**
 * Created by HP on 12/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.websites')
    .service('WebsitesService', WebsitesServiceFN);

  WebsitesServiceFN.$inject = ['WebsitesFactory'];

  /* @ngInject */
  function WebsitesServiceFN(WebsitesFactory) {

    this.getWebsitesProvider = function (filter) {
      return WebsitesFactory.websitesDataProvider(filter).$promise;
    }

    this.getWebsitesAnalysis = function (url) {
      return WebsitesFactory.websitesDataAnalisis({url:url}).$promise;
    }
  }

})();
