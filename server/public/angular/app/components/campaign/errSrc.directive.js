/**
 * Created by HP on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive('errSrc', function() {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element[0].onerror = function () {
            element[0].className = element[0].className + " image-error";
            element[0].src = 'http://img13.deviantart.net/b8fb/i/2012/069/b/3/left_handed_link__zelda__cursors_updated_fixed_bg__by_moocowlovins-d4scdmm.jpg';
          };
        }
      }
    });

})(angular);

