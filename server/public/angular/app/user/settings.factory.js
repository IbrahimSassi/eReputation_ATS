/**
 * Created by MrFirases on 4/1/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.profile')
    .factory('SettingsFactory', SettingsFactory);

  SettingsFactory.$inject = ['$resource'];

  /* @ngInject */
  function SettingsFactory($resource) {

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
        }
      }
    );


  }

})();
