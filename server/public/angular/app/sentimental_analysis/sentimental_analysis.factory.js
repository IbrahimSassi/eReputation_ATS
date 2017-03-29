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
        'update': {method: 'PUT'}
      }
    );


  }

})();
