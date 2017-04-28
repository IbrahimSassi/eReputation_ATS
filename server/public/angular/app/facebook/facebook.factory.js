/**
 * Created by Ibrahim on 21/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .factory('FacebookFactory', FacebookFactoryFN);

  FacebookFactoryFN.$inject = ['$resource'];

  /* @ngInject */
  function FacebookFactoryFN($resource) {
    return $resource('/api/facebook/:id',
      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'getLongLivedToken': {
          url: '/api/facebook/token/:token',
          method: 'GET',
          params: {
            token: '@token'
          }
          // , isArray: true


        },
        'facebookInsights': {
          url: '/api/facebook/page/:pageId/insights/:metric/:token/:since/:until',
          method: 'GET',
          params: {
            pageId: '@pageId',
            metric: '@metric',
            token: '@token',
            since: '@since',
            until: '@until'
          }
          // , isArray: true
        },
        'facebookDataProvider': {
          url: '/api/facebook/facebookDataProvider/get',
          method: 'POST'
          , isArray: true
        },
        'reputationBySentimental': {
          url: '/api/facebook/reputationBySentimental',
          method: 'POST'
          , isArray: true
        },
        'postReputation': {
          url: '/api/facebook/posts/reputation',
          method: 'POST'
        },
        'longUrl': {
          url: '/api/facebook/posts/url',
          method: 'POST'
        }
      }
    );
  }

})();
