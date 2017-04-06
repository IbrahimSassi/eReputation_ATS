/**
 * Created by MrFirases on 4/1/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.profile')
    .config(config)
    .controller('SettingsCtrl', SettingsCtrl);

  /**End My Module Init**/

  /**Injection**/
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$qProvider'];

  SettingsCtrl.$inject = ['$state', '$rootScope', 'angularLoad', '$location', 'SettingsService','$scope'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'angular/app/user/views/settings.view.html',
        controller: 'SettingsCtrl as settings',
        register: true
      })
    ;
    $qProvider.errorOnUnhandledRejections(false);


  };

  function SettingsCtrl($state, $rootScope, angularLoad, $location, SettingsService,$scope) {

    /**Scope Replace**/
    var vm = this;
    /***/

    /**
     * Initialize all attributes for business and individual
     */
    vm.basicInformationBuss = {
      activeEmail: $rootScope.currentUser.email,
      businessName: $rootScope.currentUser.businessName,
      businessType: $rootScope.currentUser.businessType,
      email: $rootScope.currentUser.email,
      employeesNumber: $rootScope.currentUser.employeesNumber,
      phoneNumber: $rootScope.currentUser.phoneNumber
    }
    vm.basicInformationIndiv = {
      activeEmail: $rootScope.currentUser.email,
      firstName: $rootScope.currentUser.firstName,
      lastName: $rootScope.currentUser.lastName,
      username: $rootScope.currentUser.username,
      email: $rootScope.currentUser.email,
      phoneNumber: $rootScope.currentUser.phoneNumber
    }
    vm.additionalInformation = {
      activeEmail: $rootScope.currentUser.email,
      profilePicture: $rootScope.currentUser.profilePicture,
      coverPicture:$rootScope.currentUser.coverPicture,
      birthday: "",
      about: $rootScope.about,
      country: $rootScope.country
    }
    vm.changePasswordAtt = {
      activeEmail: $rootScope.currentUser.email,
      oldpassword: "",
      newpassword: "",
      newpasswordagain: ""
    }
    vm.birthday = moment($rootScope.currentUser.birthday, 'DD-MM-YYYY')._i;
    console.log(vm.birthday)
    vm.EditBasicInformationIndividual = function () {
      SettingsService
        .EditBasicInformationIndividual(vm.basicInformationIndiv)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        console.log("Succ");
        $rootScope.currentUser.firstName = vm.basicInformationIndiv.firstName;
        $rootScope.currentUser.lastName = vm.basicInformationIndiv.lastName;
        $rootScope.currentUser.username = vm.basicInformationIndiv.username;
        $rootScope.currentUser.email = vm.basicInformationIndiv.email;

      }

      function errorCallback(error) {
        console.log("Err");
        if (error.status == 400) {

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };

//*******************************
    vm.EditBasicInformationBusiness = function () {
      SettingsService
        .EditBasicInformationBusiness(vm.basicInformationBuss)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        console.log("Succ");
      }

      function errorCallback(error) {
        console.log("Err");
        if (error.status == 400) {

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };
//*************************************
    vm.EditAdditionalInformation = function () {
      vm.additionalInformation.birthday = moment(vm.birthday, 'DD-MM-YYYY')._i;

      SettingsService
        .EditAdditionalInformation(vm.additionalInformation)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        console.log("Succ");
      }

      function errorCallback(error) {
        console.log("Err");
        if (error.status == 400) {

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };
//*************************************************

    vm.changePassword = function () {

      console.log(vm.changePasswordAtt);

      SettingsService
        .changePassword(vm.changePasswordAtt)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        console.log("Succ");
      }

      function errorCallback(error) {
        console.log("Err");
        if (error.status == 400) {

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };


//*********************Getting Image Base64 Codes********************

    var filePickerProfilePicIndiv = function(evt) {
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          console.log('heyyyyy: ',btoa(binaryString))
          vm.additionalInformation.profilePicture = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
      }
    };

    //***
    var filePickerCoverPicIndiv = function(evt) {
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          console.log('heyyyyy: ',btoa(binaryString))
          vm.additionalInformation.coverPicture = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
      }
    };

    //****
    var filePickerProfilePicBuss = function(evt) {
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          console.log('heyyyyy: ',btoa(binaryString))
          vm.additionalInformation.profilePicture = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
      }
    };
//**
    var filePickerCoverPicBuss = function(evt) {
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          console.log('heyyyyy: ',btoa(binaryString))
          vm.additionalInformation.coverPicture = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
      }
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      document.getElementById('filePickerProfilePicIndiv').addEventListener('change', filePickerProfilePicIndiv, false);
      document.getElementById('filePickerCoverPicIndiv').addEventListener('change', filePickerCoverPicIndiv, false);
      document.getElementById('filePickerProfilePicBuss').addEventListener('change', filePickerProfilePicBuss, false);
      document.getElementById('filePickerCoverPicBuss').addEventListener('change', filePickerCoverPicBuss, false);
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  };

})();


