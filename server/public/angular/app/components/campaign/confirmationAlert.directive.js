/**
 * Created by HP on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("confirmationAlert", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          delete: '&'
        },
        templateUrl: 'angular/app/components/campaign/confirmationAlert.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            $('#alert'+scope.myId).click(function(){
              swal({
                  title: "Are you sure?",
                  text: "You will not be able to recover Data of this Campaign !",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: 'Yes, delete it!',
                  closeOnConfirm: false,
                },
                function(){
                  $("#realDelete"+scope.myId).trigger('click');
                  swal("Deleted!", "Your Campaign has been deleted!", "success");
                });
            });

          }, 0);

        }

      };
    });

})(angular);

