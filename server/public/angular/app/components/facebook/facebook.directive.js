/**
 * Created by Ibrahim on 15/04/2017.
 */
angular.module('ATSApp.facebook')
  .directive('fb', ['$FB', function ($FB) {
    return {
      restrict: "E",
      replace: true,
      template: "<div id='fb-root'></div>",
      compile: function (tElem, tAttrs) {
        return {
          post: function (scope, iElem, iAttrs, controller) {
            var fbAppId = iAttrs.appId || '';

            var fb_params = {
              appId: iAttrs.appId || "",
              cookie: iAttrs.cookie || true,
              status: iAttrs.status || true,
              xfbml: iAttrs.xfbml || true
            };

            // Setup the post-load callback
            window.fbAsyncInit = function () {
              $FB._init(fb_params);

              if ('fbInit' in iAttrs) {
                iAttrs.fbInit();
              }
            };

            // (function(d, s, id,fbAppId) {
            //     var js, fjs = d.getElementsByTagName(s)[0];
            //     if (d.getElementById(id)) return;
            //     js = d.createElement(s); js.id = id;
            //     js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.8&appId=583444071825924";
            //     fjs.parentNode.insertBefore(js, fjs);
            //   }(document, 'script', 'facebook-jssdk',fbAppId));

            (function (d, s, id, fbAppId) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s);
              js.id = id;
              js.async = true;
              js.src = "//connect.facebook.net/en_US/all.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk', fbAppId));
          }
        }
      }
    };
  }])

  .factory('$FB', ['$rootScope', function ($rootScope) {

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

          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }
      }
    }

    return _fb;
  }]);

