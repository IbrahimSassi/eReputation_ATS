/**
 * Created by Ibrahim on 15/04/2017.
 */
angular.module('ATSApp.facebook')
  .directive('fb', ['$FB', function ($FB) {
    return {
      restrict: "E",
      replace: true,
      scope: {
        appId: '@appId',
        link: '@link',
      },
      templateUrl: 'angular/app/components/facebook/facebook.template.html',
      link: function (scope, elem, iAttrs) {

        var fbAppId = scope.appId || '';

        var fb_params = {
          appId: iAttrs.appId || "",
          cookie: iAttrs.cookie || true,
          status: iAttrs.status || true,
          xfbml: iAttrs.xfbml || true
        };

        (function (d, s, id, fbAppId) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.async = true;
          js.src = "//connect.facebook.net/en_US/all.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk', fbAppId));

        setTimeout(function () {

          // Setup the post-load callback
          window.fbAsyncInit = function () {
            $FB._init(fb_params);

            if ('fbInit' in iAttrs) {
              iAttrs.fbInit();
            }
          };


        }, 0);


        init();
        function init() {

          setTimeout(function () {
            var preTransformed = scope.link;
            console.log("scope", scope.link)
            var tab = preTransformed.split("/")
            preTransformed = tab[3].split("_");
            var link = "https://www.facebook.com/" + preTransformed[0] + "/posts/" + preTransformed[1];
            scope.mylink = link;

          }, 0)

        }

        scope.$watch('link', function (newvalue, oldvalue) {
          console.log("newvalue",newvalue)
          console.log("oldvalue",oldvalue)
          console.log("hello")
          init();
        })


      }
    }
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

