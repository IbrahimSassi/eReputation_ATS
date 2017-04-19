/**
 * Created by MrFirases on 4/1/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.profile')
    .service('SettingsService', SettingsService);

  SettingsService.$inject = ['$http', '$window', 'SettingsFactory'];


  function SettingsService($http, $window, SettingsFactory) {

    var EditBasicInformationIndividual = function (userToEdit) {
      //return $http.post('/users/register', user)
      return SettingsFactory.basicinformationIndiv({
        activeEmail: userToEdit.activeEmail,
        email: userToEdit.email,
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        username: userToEdit.username,
        phoneNumber: userToEdit.phoneNumber
      }).$promise;
    };

    var EditBasicInformationBusiness = function (userToEdit) {
      //return $http.post('/users/register', user)
      return SettingsFactory.basicinformationBuss({
        activeEmail: userToEdit.activeEmail,
        email: userToEdit.email,
        businessName: userToEdit.businessName,
        businessType: userToEdit.businessType,
        employeesNumber: userToEdit.employeesNumber,
        phoneNumber: userToEdit.phoneNumber
      }).$promise;
    };

    var EditAdditionalInformation = function (userToEdit,file) {
      $http.post('/users/settings/profile', {
        file: file
      });
      //return $http.post('/users/register', user)
      return SettingsFactory.additionalInformation(userToEdit).$promise;
    };

    var changePassword = function (userToEdit) {
      console.log("heh", userToEdit.activeEmail)
      return SettingsFactory.changepaswword({
        activeEmail: userToEdit.activeEmail,
        oldpassword: userToEdit.oldpassword,
        newpassword: userToEdit.newpassword
      }).$promise;
    };


    return {
      EditBasicInformationIndividual: EditBasicInformationIndividual,
      EditBasicInformationBusiness: EditBasicInformationBusiness,
      EditAdditionalInformation: EditAdditionalInformation,
      changePassword: changePassword
    };


  }

})();

