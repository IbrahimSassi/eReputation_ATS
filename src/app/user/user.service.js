/**
 * Created by MrFirases on 2/2/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.user')
    .service('UserService', UserServiceFN);

  UserServiceFN.$inject = ['UserFactory'];


  function UserServiceFN(UserFactory) {


    this.getAllUsers = function () {

      return UserFactory.query().$promise;

    }


  }


})();

