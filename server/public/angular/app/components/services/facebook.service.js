/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook',[])
    .service('FacebookService', FacebookServiceFN);

  FacebookServiceFN.$inject = ['FacebookFactory', '$http'];

  /* @ngInject */
  function FacebookServiceFN(FacebookFactory, $http) {


    this.statusChangeCallback = statusChangeCallbackFN;
    this.checkLoginState = checkLoginStateFN;
    this.initFacebookApi = initFacebookApiFN;
    this.testAPI = testAPIFN;
    this.doLogin = doLoginFN;



    function statusChangeCallbackFN(response) {
      console.log('statusChangeCallback');
      console.log(response);

      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        document.cookie = "token="+response.authResponse.accessToken;

        testAPI();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into Facebook.';
      }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginStateFN() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }



    function initFacebookApiFN() {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '583444071825924',
          cookie     : false,  // enable cookies to allow the server to access
          // the session
          xfbml      : false,  // parse social plugins on this page
          version    : 'v2.8' // use graph api version 2.8
        });

        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });

      };

      // Load the SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

    }


    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPIFN() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        // document.getElementById('status').innerHTML =
        //   'Thanks for logging in, ' + response.name + '!';
      });
    }


    function doLoginFN(){
      FB.login(function(response) {
        if (response.authResponse) {
          console.log(response)

          document.cookie = "token="+response.authResponse.accessToken;

          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
            console.log('Good to see you, ',response);
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email,business_management,manage_pages,pages_manage_cta,publish_pages,read_insights'});

    }



  }

})();
