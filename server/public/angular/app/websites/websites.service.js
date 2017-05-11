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

    this.getWebsitesAnalysisKeywords = function (filter) {
      return WebsitesFactory.websitesKeywordsAnalysis(filter).$promise;
    }
    this.getWebsitesAnalysisKeywordsNeg = function (filter) {
      return WebsitesFactory.websitesKeywordsAnalysisAllNeg(filter).$promise;
    }

    this.getWebsitesAnalysisKeywordsPos = function (filter) {
      return WebsitesFactory.websitesKeywordsAnalysisAllPos(filter).$promise;
    }

    this.getWebsitesAnalysis = function (url) {
      return WebsitesFactory.websitesDataAnalisis({url: url}).$promise;
    }
    this.getAllwebSitesProvider = function () {
      return WebsitesFactory.query().$promise;
    }
  }

})();
