/**
 * Created by HP on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("dateDisplay", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          dateOn: '@dateOn',
          dateEnd: '@dateEnd'
        },
        templateUrl: 'angular/app/components/campaign/date.display.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            //variables
            var sliderLength = moment(scope.dateEnd,'DD/MM/YYYY').diff(moment(scope.dateOn,'DD/MM/YYYY'), 'days');
            var fromNowDate=  moment(scope.dateEnd,'DD/MM/YYYY').diff(moment(), 'days');
            var sliderPosition=sliderLength-fromNowDate;
            var sliderValues = [];
            //--------------
            //First Value in the table
            sliderValues.push(moment(scope.dateOn).format("YYYY MMM Do"));

            //Other Value in the table
            for (var i = 0; i < sliderLength; i++) {

              //current Date Value in table
              if(i===sliderLength-fromNowDate)
              {
                sliderValues.push(moment().format("YYYY MMM Do"))
              }
              //others
              else
              {
                sliderValues.push(" ");
              }

            }
            //last value in the table
            sliderValues.push(moment(scope.dateEnd).format("YYYY MMM Do"));
;

            var myElem = "#range" + scope.myId;
            $(myElem).ionRangeSlider({

              from: sliderPosition+1,
              values: sliderValues
            });

            $('#alert'+scope.myId).click(function(){
              swal({
                  title: "Are you sure?",
                  text: "You will not be able to recover this imaginary file!",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: 'Yes, delete it!',
                  closeOnConfirm: false
                },
                function(){
                  swal("Deleted!", "Your imaginary file has been deleted!", "success");
                });
            });

          }, 0);

        }

      };
    });

})(angular);

