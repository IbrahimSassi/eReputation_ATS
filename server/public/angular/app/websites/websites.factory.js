/**
 * Created by HP on 12/04/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.websites', [])
    .factory('WebsitesFactory', WebsitesFactoryFN);

  WebsitesFactoryFN.$inject = ['$resource'];

  /* @ngInject */
  function WebsitesFactoryFN($resource) {
    return $resource('/api/websites/:id',
      {id: '@id'},
      {
        'update': {method: 'PUT'},

        'websitesKeywordsAnalysis': {
          url: '/api/websites/keys',
          method: 'POST'
          , isArray: true
        },
        'websitesKeywordsAnalysisAllNeg': {
          url: '/api/websites/allkeys-neg',
          method: 'POST'
          , isArray: true
        },
        'websitesKeywordsAnalysisAllPos': {
          url: '/api/websites/allkeys-pos',
          method: 'POST'
          , isArray: true
        },

        'websitesDataProvider': {
          url: '/api/websites',
          method: 'POST'
          , isArray: true
        },
        'websitesDataAnalisis': {
          url: '/api/websites/getAnalysis/:url',
          method: 'GET',
          params: {
            url: '@url',
          }

        },
      }
    );
  }

})();
