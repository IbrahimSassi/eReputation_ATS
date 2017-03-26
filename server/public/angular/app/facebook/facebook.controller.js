/**
 * Created by Ibrahim on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook', [])
    .config(config)
    .controller('FacebookController', FacebookControllerFN);

  FacebookControllerFN.$inject = ['$scope'];
  config.$inject = ['$stateProvider', '$urlRouterProvider'];


  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('test', {
        url: '/test/charts',
        templateUrl: 'angular/app/facebook/views/testingInsights.html',
        controller: 'FacebookController as vm',
        cache: false
      })
    ;

  };


  /* @ngInject */
  function FacebookControllerFN($scope) {
    var vm = this;
    vm.title = 'FacebookController';

    activate();

    ////////////////

    function activate() {

      // vm.dataSource = {
      //   chart: {
      //     caption: "Harry's SuperMart",
      //     subCaption: "Top 5 stores in last month by revenue",
      //     numberPrefix: "$",
      //     theme: "fint",
      //     // usePlotGradientColor:0
      //   },
      //   data: [{
      //     label: "Bakersfield Central",
      //     value: "880000"
      //   },
      //     {
      //       label: "Garden Groove harbour",
      //       value: "730000"
      //     },
      //     {
      //       label: "Los Angeles Topanga",
      //       value: "590000"
      //     },
      //     {
      //       label: "Compton-Rancho Dom",
      //       value: "520000"
      //     },
      //     {
      //       label: "Daly City Serramonte",
      //       value: "330000"
      //     }],
      //   "trendlines": [
      //     {
      //       "line": [
      //         {
      //           "startvalue": "700000",
      //           "color": "#1aaf5d",
      //           "valueOnRight": "1",
      //           "displayvalue": "Monthly Target"
      //         }
      //       ]
      //     }
      //   ]
      //
      // };
      //
      //
      //
      // vm.selectedValue = "Please click on a column";
      // vm.events = {
      //   dataplotclick: function(ev, props) {
      //     $scope.$apply(function() {
      //       console.log(props)
      //       vm.selectedValue = "You clicked on: " + props.categoryLabel;
      //     });
      //   }
      // };



    }
  }

})();

