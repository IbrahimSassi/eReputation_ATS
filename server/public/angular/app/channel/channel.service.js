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
        'getEventsByOrganization': {
          url: 'http://localhost:18080/Eventify-web/rest/organization/:idOrganization/events',
          method: 'GET',
          params: {
            idOrganization: '@idOrganization',
          },
          isArray: true


        },
        'getMyRate': {
          url: 'http://localhost:18080/Eventify-web/rest/events/:idEvent/rate',
          method: 'GET',
          params: {
            idOrganization: '@idEvent',
          },
          isArray: false


        },
        'getMyTickets': {
          url: 'http://localhost:18080/Eventify-web/rest/events/:idEvent/tickets',
          method: 'GET',
          params: {
            idEvent: '@idEvent',
          },
          isArray: true


        }


      }
    );
  }

})();
