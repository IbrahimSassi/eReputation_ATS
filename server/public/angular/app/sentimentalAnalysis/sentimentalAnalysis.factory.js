/**
 * Created by ninou on 3/29/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.wwsa')
    .factory('WwsaFactory', WwsaFactory);

  WwsaFactory.$inject = ['$resource'];

  /* @ngInject */
  function WwsaFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('api/wwsa/:id',

      {id: '@id'},
      {
        'update': {method: 'PUT'},
          'PositivitybyCompaign': {
              url: '/api/wwsa/PositivitybyCompaign/:id',
              method: 'GET',
              params: {
                  id: '@id'
              }
          },
          'NegativityByCompaign': {
              url: '/api/wwsa/NegativityByCompaign/:id',
              method: 'GET',
              params: {
                  id: '@id'
              }
          },
          'NeutralByCompaign': {
              url: '/api/wwsa/NeutralByCompaign/:id',
              method: 'GET',
              params: {
                  id: '@id'
              }
          },

        'CompaignSentimental': {
          url: '/api/wwsa/CompaignSentimental',
          method: 'POST',
          isArray: true
        },
        'ChannelSentimental': {
          url: '/api/wwsa/ChannelSentimental',
          method: 'POST',
          isArray: true
        },

        'FbSentimental': {
          url: '/api/wwsa/ChannelSentimental',
          method: 'POST',
          isArray: true
        },
        'WebSentimental': {
          url: '/api/wwsa/ChannelSentimental',
          method: 'POST',
          isArray: true
        },



      }
    );


  }

})();
