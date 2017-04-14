/**
 * Created by MrFirases on 4/10/2017.
 */


(function () {
  'use strict';

  angular
    .module('ATSApp.twitter',[])
    .factory('TwitterFactory', TwitterFactory);

  TwitterFactory.$inject = ['$resource'];

  /* @ngInject */
  function TwitterFactory($resource) {

    /** Change The Link To your Rest URL From the JAVA EE APP*/
    return $resource('/users/register',

      {id: '@id'},
      {
        'update': {method: 'PUT'},
        'GetChannelByID': {
          url: '/api/channels/:id',
          method: 'GET',
          params: {
            id: '@id',
          }
        },
        'GetUserInfo': {
          url: '/api/twitter/GetUserInfo/:screen_name',
          method: 'POST',
          params: {
            screen_name: '@screen_name',
          }
        },
        'GetSentimentalForOneChannelForMention': {
          url: '/api/twitter/getTwitterSentimentalForMention',
          method: 'POST'
          , isArray: true
        },
        'GetSentimentalForOneChannelForReply': {
          url: '/api/twitter/getTwitterSentimentalForReply',
          method: 'POST'
          , isArray: true
        },
        'GetTopTweet': {
          url: '/api/twitter/getTopTweet',
          method: 'POST'
        },
        'GetTopHashtags': {
          url: '/api/twitter/getTopHashtags',
          method: 'POST'
          , isArray: true
        },
        'getTwitterSentimentalForAll': {
          url: '/api/twitter/getTwitterSentimentalForAll',
          method: 'POST'
          , isArray: true
        }

      }
    );


  }

})();
