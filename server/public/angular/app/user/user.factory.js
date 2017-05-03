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
    return $resource('/users/register',

      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'Register': {
          url: '/users/register',
          method: 'POST'
        },
        'Login': {
          url: '/users/LOGIN',
          method: 'POST'
        },
        'SendVerificationEmail': {
          url: '/users/verification/generate/:email',
          method: 'POST',
          params: {
            email: '@email',
          },

        },
        'requestNewPassword': {
          url: '/users/verification/requestNewPassword/:email',
          method: 'POST',
          params: {
            email: '@email',
          }
        },
        'changePassword': {
          url: '/users/verification/changePassword',
          method: 'POST'
        }
      }
    );


  }

})();
