/**
 * Created by MrFirases on 2/2/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp-front.user')
    .factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$resource'];

  /* @ngInject */
  function UserFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('https://jsonplaceholder.typicode.com/posts/:id',

      {id: '@id'},
      {
        'update': {method: 'PUT'}
      }
    );


  }

})();