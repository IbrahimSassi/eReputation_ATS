/**
 * Created by MrFirases on 2/2/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp-front.user')
    .service('UserService', UserServiceFN);

  UserServiceFN.$inject = ['UserFactory','$http', '$window'];


  function UserServiceFN(UserFactory,$http, $window) {


    this.getAllUsers = function () {

      return UserFactory.query().$promise;

    }

    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
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
          email : payload.email,
          name : payload.name
        };
      }
    };

     var register = function(user) {
      return $http.post('/users/register', user).then(function(data,err){
        saveToken(data.token);
      });
    };

     var login = function(user) {
      return $http.post('/users/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };





  }


})();

