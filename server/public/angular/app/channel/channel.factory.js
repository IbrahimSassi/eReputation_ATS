/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .factory('ChannelFactory', ChannelFactoryFN);

  ChannelFactoryFN.$inject = ['$resource'];

  /* @ngInject */
  function ChannelFactoryFN($resource) {
    return $resource('/api/channels/:id',
      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'getChannelsByUser': {
          url: '/api/channels/user/:userId',
          method: 'GET',
          params: {
            userId: '@userId',
          },
          isArray: true


        }
      }
    );
  }

})();
