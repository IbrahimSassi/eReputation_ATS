/**
 * Created by MrFirases on 4/10/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.twitter')
    .service('TwitterService', TwitterService);

  TwitterService.$inject = ['$http', '$window','TwitterFactory'];


  function TwitterService($http, $window,TwitterFactory) {


    var GetChannelByID = function (id) {

      return TwitterFactory.GetChannelByID({id:id}).$promise;
    };

    var GetUserInfo = function (screen_name) {

      return TwitterFactory.GetUserInfo({screen_name:screen_name}).$promise;
    };

    return {
      GetChannelByID : GetChannelByID,
      GetUserInfo : GetUserInfo
    };


  }


})();

