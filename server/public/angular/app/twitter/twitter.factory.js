/**
 * Created by MrFirases on 4/10/2017.
 */


(function () {
  'use strict';

  angular
    .module('ATSApp.twitter',[])
    .factory('TwitterFactory', TwitterFactory);

  TwitterFactory.$inject = ['$resource'];

  /* @ngInject */
  function TwitterFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('/users/register',

      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'GetChannelByID': {
          url: '/api/channels/:id',
          method: 'GET',
          params: {
            id: '@id',
          }
        },
        'GetUserInfo': {
          url: '/api/twitter/GetUserInfo/:screen_name',
          method: 'POST',
          params: {
            screen_name: '@screen_name',
          }
        },
        'SendVerificationEmail': {
          url: '/users/verification/generate/:email',
          method: 'POST',
          params: {
            email: '@email',
          },
        }
      }
    );


  }

})();
