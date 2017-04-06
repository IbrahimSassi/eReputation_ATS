/**
 * Created by MrFirases on 3/30/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp-front.user')
    .service('EmailConfirmService', EmailConfirmService);

  EmailConfirmService.$inject = ['$http', '$window', 'EmailConfirmFactory'];


  function EmailConfirmService($http, $window, EmailConfirmFactory) {

    var CheckToken = function (token) {
      //return $http.post('/users/login', user)
      return EmailConfirmFactory.get({token: token}).$promise;
    };

    return {
      CheckToken: CheckToken
    };


  }


})();

