/**
 * Created by MrFirases on 3/30/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp-front.user')
    .factory('EmailConfirmFactory', EmailConfirmFactory);

  EmailConfirmFactory.$inject = ['$resource'];

  /* @ngInject */
  function EmailConfirmFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('/users/verification/validate/:token',

      {token: '@token'},
      {
      }
    );


  }

})();
