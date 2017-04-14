/**
 * Created by HP on 12/04/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.websites',[])
    .factory('WebsitesFactory', WebsitesFactoryFN);

  WebsitesFactoryFN.$inject = ['$resource'];

  /* @ngInject */
  function WebsitesFactoryFN($resource) {
    return $resource('/api/websites/:id',
      {id: '@id'},
      {
        'update': {method: 'PUT'},


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
