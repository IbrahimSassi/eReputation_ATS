/**
 * Created by MrFirases on 3/20/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp-front.profile')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'UserService'];


  function meanData($http, UserService) {


    var getProfile = function () {
      return $http.get('/users/profile', {
        headers: {
          Authorization: 'Bearer '+ UserService.getToken()
        }
      });
    };

    return {
      getProfile : getProfile
    };




  }


})();

