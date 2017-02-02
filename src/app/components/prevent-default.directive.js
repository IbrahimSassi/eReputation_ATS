/**
 * Created by Ibrahim on 02/02/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive('preventDefault', function () {
      return function (scope, element, attrs) {
        angular.element(element).bind('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    });


})(angular);

