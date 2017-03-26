/**
 * Created by HP on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .factory('CampaignFactory', CampaignFactory);

  CampaignFactory.$inject = ['$resource'];

  /* @ngInject */
  function CampaignFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('api/campaigns/:id',

      {id: '@id'},
      {
        'update': {method: 'PUT'}
      }
    );


  }

})();
