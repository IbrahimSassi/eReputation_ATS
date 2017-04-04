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

  SettingsCtrl.$inject = ['$state','$rootScope','angularLoad','$location','SettingsService'];
  /**End Of Injection**/


  /** Route Config **/
  function config($stateProvider, $urlRouterProvider, $qProvider) {

    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'angular/app/user/views/settings.view.html',
        controller: 'SettingsCtrl as settings',
        register:true
      })
    ;
    $qProvider.errorOnUnhandledRejections(false);


  };

  function SettingsCtrl($state,$rootScope,angularLoad,$location,SettingsService) {

    /**Scope Replace**/
    var vm = this;
    /***/

    /**
     * Initialize all attributes for business and individual
     */
  vm.basicInformationBuss = {activeEmail:$rootScope.currentUser.email,businessName:$rootScope.currentUser.businessName, businessType:$rootScope.currentUser.businessType, email:$rootScope.currentUser.email, employeesNumber:$rootScope.currentUser.employeesNumber, phoneNumber:$rootScope.phoneNumber}
  vm.additionalInformation = {activeEmail:$rootScope.currentUser.email,profilePicture:"", CoverPicture:"", about:$rootScope.about, birthday:$rootScope.birthday, country:$rootScope.country}
  vm.basicInformationIndiv = {activeEmail:$rootScope.currentUser.email,firstName:$rootScope.currentUser.firstName, lastName:$rootScope.currentUser.lastName, username:$rootScope.currentUser.username, email:$rootScope.currentUser.email, phoneNumber:$rootScope.phoneNumber}
  vm.changePassword = {activeEmail:$rootScope.currentUser.email,oldpassword:"", newpassword:"", newpasswordagain:""}


    vm.EditBasicInformationIndividual = function () {
      SettingsService
        .EditBasicInformationIndividual(vm.basicInformationIndiv)
        .then(successCallback, errorCallback);



      function successCallback(response){
      console.log("Succ");
      }
      function errorCallback(error){
        console.log("Err");
        if (error.status ==400)
        {

        }
        else if (error.status ==401)
          vm.errorInvalid = true;
      }
    };

//*******************************
    vm.EditBasicInformationBusiness = function () {
      SettingsService
        .EditBasicInformationBusiness(vm.basicInformationBuss)
        .then(successCallback, errorCallback);



      function successCallback(response){
        console.log("Succ");
      }
      function errorCallback(error){
        console.log("Err");
        if (error.status ==400)
        {

        }
        else if (error.status ==401)
          vm.errorInvalid = true;
      }
    };
//*************************************
    vm.EditAdditionalInformation = function () {
      SettingsService
        .EditAdditionalInformation(vm.additionalInformation)
        .then(successCallback, errorCallback);



      function successCallback(response){
        console.log("Succ");
      }
      function errorCallback(error){
        console.log("Err");
        if (error.status ==400)
        {

        }
        else if (error.status ==401)
          vm.errorInvalid = true;
      }
    };



  };

})();


