/**
 * Created by MrFirases on 4/1/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.profile')
    .factory('SettingsFactory', SettingsFactory);

  SettingsFactory.$inject = ['$resource','$window'];

  /* @ngInject */
  function SettingsFactory($resource,$window) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('/users/settings',


      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'basicinformationIndiv': {
          url: '/users/settings/basicinformationIndiv',
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + $window.localStorage['mean-token']
          },
          params: {
            activeEmail: '@activeEmail',
            email: '@email',
            firstName: '@firstName',
            lastName: '@lastName',
            username: '@username',
            phoneNumber: '@phoneNumber'
          }
        },
        'basicinformationBuss': {
          url: '/users/settings/basicinformationBuss/:activeEmail/:email/:businessName/:businessType/:employeesNumber/:phoneNumber',
          method: 'PUT',
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
          url: '/users/settings/additionalInformation',
          method: 'PUT',


        },
        'changepaswword': {
          url: '/users/settings/changepassword/:activeEmail/:oldpassword/:newpassword',
          method: 'PUT',
          params: {
            activeEmail: '@activeEmail',
            oldpassword: '@oldpassword',
            newpassword: '@newpassword',


          },
        }
      }
    );


  }

})();
