/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .service('FacebookService', FacebookServiceFN)
    .factory('$FB', FacebookLoaderFactoryFN);

  FacebookServiceFN.$inject = ['FacebookFactory', '$http', '$FB'];
  FacebookLoaderFactoryFN.$inject = ['$rootScope'];


  /* @ngInject */
  function FacebookServiceFN(FacebookFactory, $http,$FB) {


    var self = this;
    this.statusChangeCallback = statusChangeCallbackFN;
    this.checkLoginState = checkLoginStateFN;
    this.initFacebookApi = initFacebookApiFN;
    this.testAPI = testAPIFN;
    this.doLogin = doLoginFN;
    this.getLongLivedToken = getLongLivedTokenFN;
    this.getFansPage = getFansPageFN;
    this.getPageImpressions = getPageImpressionsFN;
    this.getPageStoriesByStoryType = getPageStoriesByStoryTypeFN;
    this.getPageStorytellersByAgeGender = getPageStorytellersByAgeGenderFN;
    this.getPageStorytellersByCountry = getPageStorytellersByCountryFN;
    this.getPageEngagedUsers = getPageEngagedUsersFN;
    this.getPageNegativeFeedbackByType = getPageNegativeFeedbackByTypeFN;
    this.getPageNegativeFeedback = getPageNegativeFeedbackFN;
    this.getPagePositiveFeedbackByType = getPagePositiveFeedbackByTypeFN;
    this.getPageFansOnline = getPageFansOnlineFN;
    this.getPageActionsPostReactionsTotal = getPageActionsPostReactionsTotalFN;
    this.getPageFansCountry = getPageFansCountryFN;
    this.getPageViewsTotal = getPageViewsTotalFN;
    this.getPageVideoViews = getPageVideoViewsFN;
    this.getFacebookPosts = getFacebookPostsFN;
    this.getReputationBySentimental = getReputationBySentimentalFN;
    this.getReputationByReaction = getReputationByReactionFN;
    this.getReputationByShares = getReputationBySharesFN;
    this.getReputationByTypes = getReputationByTypesFN;
    this.getTopPosts = getTopPostsFN;
    this.getReputationByPost = getReputationByPostFN;
    this.getLongUrl = getLongUrlFN;
    this.loadSDK = loadSDK;
    var loaded = false;

    function statusChangeCallbackFN(response) {
      return new Promise(function (resolve, reject) {

        // console.log('statusChangeCallback');
        // console.log(response);

        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          document.cookie = "token=" + response.authResponse.accessToken;
          self.testAPI().then(function (data) {
            response.user = data;
            resolve(response);

          });
        } else if (response.status === 'not_authorized') {
          self.doLogin().then(function (data) {
            resolve(data);
          });
          // The person is logged into Facebook, but not your app.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
        } else {
          self.doLogin().then(function (data) {
            resolve(data);

          });
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
        }


      })
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginStateFN() {
      FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    }

    function loadSDK() {
      // Load the SDK asynchronously
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

    }


    function initFacebookApiFN() {
      return new Promise(function (resolve, reject) {


        if(!$FB.loader)
        {
          $FB._init({
            appId: '583444071825924',
            cookie: false,  // enable cookies to allow the server to access
            // the session
            xfbml: false,  // parse social plugins on this page
            version: 'v2.8' // use graph api version 2.8
          })
        }

        window.FB.getLoginStatus(function (response) {
          self.statusChangeCallback(response).then(function (data) {
            resolve(data);
          });
        });

        // window.fbAsyncInit = function () {
        //
        // };
        //
        // loadSDK();

      });

    }


    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPIFN() {
      return new Promise(function (resolve, reject) {
        // console.log('Welcome!  Fetching your information.... ');
        FB.api('/me?fields=id,name,accounts', function (response) {
          // console.log('Successful login for: ' + response.name);
          resolve(response);
          // document.getElementById('status').innerHTML =
          //   'Thanks for logging in, ' + response.name + '!';
        });

      })
    }


    function doLoginFN() {

      return new Promise(function (resolve, reject) {
        FB.login(function (res) {
          if (res.authResponse) {
            // resolve(res);
            document.cookie = "token=" + res.authResponse.accessToken;

            // console.log('Welcome!  Fetching your information.... ');
            FB.api('/me?fields=id,name,accounts', function (response) {
              res.user = response;
              // console.log('Good to see you, ', response);
              resolve(res);
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
            reject()
          }
        }, {
          scope: 'public_profile,' +
          'email,' +
          'business_management,' +
          'manage_pages,' +
          'pages_manage_cta,' +
          'publish_pages,' +
          'read_insights,' +
          'pages_show_list,' +
          'read_audience_network_insights'
        });

      })


    }


    function getLongLivedTokenFN(token) {
      return FacebookFactory.getLongLivedToken({token: token}).$promise;
    }


    function getFansPageFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_fans',
        token: token,
        since: since,
        until: until
      }).$promise;
    }

    function getPageImpressionsFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_impressions',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageStoriesByStoryTypeFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_stories_by_story_type',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageStorytellersByAgeGenderFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_storytellers_by_age_gender',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageStorytellersByCountryFN(pageId, token, since, until) {
      return new Promise(function (resolve, reject) {
        var storytellersByCountry = [];
        FacebookFactory.facebookInsights({
          pageId: pageId,
          metric: 'page_storytellers_by_country',
          token: token,
          since: since,
          until: until
        }).$promise.then(function (data) {
          var LocalStorytellers = data.data;
          LocalStorytellers[0].values.forEach(function (obj) {
            if (obj.value)
              Object.assign(storytellersByCountry, obj.value);

          });
          resolve(storytellersByCountry);

        });
      })
    }

    function getPageEngagedUsersFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_engaged_users',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageNegativeFeedbackByTypeFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_negative_feedback_by_type',
        token: token,
        since: since,
        until: until
      }).$promise;
    }

    function getPageNegativeFeedbackFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_negative_feedback',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPagePositiveFeedbackByTypeFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_positive_feedback_by_type',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageFansOnlineFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_fans_online_per_day',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageActionsPostReactionsTotalFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_actions_post_reactions_total',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageFansCountryFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_fans_country',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageViewsTotalFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_views_total',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getPageVideoViewsFN(pageId, token, since, until) {
      return FacebookFactory.facebookInsights({
        pageId: pageId,
        metric: 'page_video_views',
        token: token,
        since: since,
        until: until
      }).$promise;
    }


    function getFacebookPostsFN(filter) {
      return FacebookFactory.facebookDataProvider(filter).$promise;
    }

    function getReputationBySentimentalFN(filter) {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.type = "sentimental";
      return FacebookFactory.reputationBySentimental(LocalFilter).$promise;
    }

    function getReputationByReactionFN(filter) {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.type = "reactions";
      return FacebookFactory.reputationBySentimental(LocalFilter).$promise;
    }

    function getReputationBySharesFN(filter) {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.type = "shares";
      return FacebookFactory.reputationBySentimental(LocalFilter).$promise;
    }

    function getReputationByTypesFN(filter) {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.type = "postsType";

      return FacebookFactory.reputationBySentimental(LocalFilter).$promise;
    }

    function getTopPostsFN(filter, sort) {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.type = "topPosts";
      LocalFilter.sort = sort;
      return FacebookFactory.reputationBySentimental(LocalFilter).$promise;
    }


    function getReputationByPostFN(query) {
      return FacebookFactory.postReputation(query).$promise;
    }

    function getLongUrlFN(url) {
      return FacebookFactory.longUrl({url: url}).$promise;
    }

  }


  function FacebookLoaderFactoryFN() {

    var fbLoaded = false;

    // Our own customisations
    var _fb = {
      loaded: fbLoaded,
      _init: function (params) {
        if (window.FB) {
          angular.extend(window.FB, _fb);
          angular.extend(_fb, window.FB);

          // Set the flag
          _fb.loaded = true;

          // Initialise FB SDK
          window.FB.init(params);
          console.log(window.FB)
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }
      }
    };

    return _fb;

  }

})();
