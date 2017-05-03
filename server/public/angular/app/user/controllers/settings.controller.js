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

  SettingsCtrl.$inject = ['$state', '$rootScope', 'angularLoad', '$location', 'SettingsService','$scope','ProfileService','$http'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'angular/app/user/views/settings.view.html',
        controller: 'SettingsCtrl as settings',
        authenticate: true
      })

    ;
    $qProvider.errorOnUnhandledRejections(false);


  };

  function SettingsCtrl($state, $rootScope, angularLoad, $location, SettingsService,$scope,ProfileService,$http) {

    /**Scope Replace**/
    var vm = this;

    vm.basicBuss = false;
    vm.additBuss = false;
    vm.passwordBuss = false;

    vm.basicIndiv = false;
    vm.additIndiv = false;
    vm.passwordIndiv = false;


    $scope.zz = "haha";

      //*


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
      phoneNumber: parseInt($rootScope.currentUser.phoneNumber)
    };
    vm.basicInformationIndiv = {
      activeEmail: $rootScope.currentUser.email,
      firstName: $rootScope.currentUser.firstName,
      lastName: $rootScope.currentUser.lastName,
      username: $rootScope.currentUser.username,
      email: $rootScope.currentUser.email,
      phoneNumber: parseInt($rootScope.currentUser.phoneNumber)
    };
    vm.additionalInformation = {
      activeEmail: $rootScope.currentUser.email,
      profilePicture: "",
      coverPicture:"",
      birthday: "",
      about: $rootScope.currentUser.about,
      country: $rootScope.currentUser.country
    };

    vm.changePasswordAtt = {
      activeEmail: $rootScope.currentUser.email,
      oldpassword: "",
      newpassword: "",
      newpasswordagain: ""
    };

    vm.birthday = moment($rootScope.currentUser.birthday).format('DD-MM-YYYY');
    //vm.birthdayInd = moment($rootScope.currentUser.birthday, 'DD-MM-YYYY')._i;
    vm.EditBasicInformationIndividual = function () {
      SettingsService
        .EditBasicInformationIndividual(vm.basicInformationIndiv)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        swal("Profile Updated!", "Your settings was updating successfully!", "success");
        ProfileService.saveToken(response.token);

        vm.basicIndiv = false;
      }

      function errorCallback(error) {
        if (error.status == 400) {
          vm.basicIndiv = true;
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
        vm.basicBuss = false;
        swal("Profile Updated!", "Your settings was updating successfully!", "success");
        ProfileService.saveToken(response.token);
      }

      function errorCallback(error) {
        if (error.status == 400) {
          vm.basicBuss = true;

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };
//*************************************
    vm.EditAdditionalInformation = function () {
      vm.additionalInformation.birthday = moment(vm.birthday).format('DD-MM-YYYY');
      SettingsService
        .EditAdditionalInformation(vm.additionalInformation)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        vm.additBuss = false;
        vm.additIndiv = false;
        swal("Profile Updated!", "Your settings was updating successfully!", "success");
        ProfileService.saveToken(response.token);
      }

      function errorCallback(error) {
        vm.additBuss = true;
        vm.additIndiv = true;
        if (error.status == 400) {

        }
        else if (error.status == 401)
          vm.errorInvalid = true;
      }
    };
//*************************************************

    vm.changePassword = function () {


      SettingsService
        .changePassword(vm.changePasswordAtt)
        .then(successCallback, errorCallback);


      function successCallback(response) {
        swal("Password Changed!", "Your password was updated successfully!", "success");
        vm.passwordBuss = false;
        vm.passwordIndiv = false;
      }

      function errorCallback(error) {
        vm.passwordBuss = true;
        vm.passwordIndiv = true;
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


