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
    return $resource('/users/settings',

      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'basicinformationIndiv': {
          url: '/users/settings/:activeEmail/:email/:firstName/:lastName/:username/:phoneNumber',
          method: 'POST',
          params: {
            activeEmail: '@activeEmail',
            email: '@email',
            firstName: '@firstName',
            lastName: '@lastName',
            username: '@username',
            phoneNumber: '@phoneNumber',
          }
        },
        'basicinformationBuss': {
          url: '/users/settings/:activeEmail/:email/:businessName/:businessType/:employeesNumber/:phoneNumber',
          method: 'POST',
          params: {
            activeEmail: '@activeEmail',
            email: '@email',
            businessName: '@businessName',
            businessType: '@businessType',
            employeesNumber: '@employeesNumber',
            phoneNumber: '@phoneNumber',

          }
        },
        'additionalInformation': {
          url: '/users/settings/:activeEmail/:profilePicture/:coverPicture/:about/:birthday/:country',
          method: 'POST',
          params: {
            activeEmail: '@activeEmail',
            profilePicture: '@profilePicture',
            coverPicture: '@coverPicture',
            about: '@about',
            birthday: '@birthday',
            country: '@country',

          },
        }
      }
    );


  }

})();
