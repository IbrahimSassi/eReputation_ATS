/**
 * Created by MrFirases on 3/20/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.profile')
    .service('ProfileService', ProfileService);

  ProfileService.$inject = ['$http','$window'];


  function ProfileService($http,$window) {


    var getProfile = function () {
      return $http.get('/users/profile', {
        headers: {
          Authorization: 'Bearer '+ getToken()
        }
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };
    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          username : payload.username,
          firstName : payload.firstName,
          lastName: payload.lastName,
          email : payload.email,
          businessName: payload.businessName,
          employeesNumber: payload.employeesNumber,
          businessType: payload.businessType,
          accountType: payload.kind,
          creationDate: payload.creationDate,
          state : payload.state,
          kind : payload.kind,
          expiration: payload.exp
        };
      }
    };

    return {
      getProfile : getProfile,
      logout : logout,
      getToken : getToken,
      currentUser : currentUser,
      isLoggedIn : isLoggedIn
    };



  }


})();

