/**
 * Created by Ibrahim on 01/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .service('colorPickerService', colorPickerService);

  colorPickerService.$inject = [];

  /* @ngInject */
  function colorPickerService() {


    this.getRandomColor = getRandomColorFN;

    var colors = [
      {
        color: "#F7464A",
        highlight: "#FF5A5E"
      }
      , {
        color: "#46BFBD",
        highlight: "#5AD3D1"
      }
      , {
        color: "#FDB45C",
        highlight: "#FFC870"

      }
      , {
        color: "#27ae60",
        highlight: "#2ecc71"

      }
      , {
        color: "#16a085",
        highlight: "#1abc9c"

      }
      , {
        color: "#8e44ad",
        highlight: "#9b59b6"

      }
      , {
        color: "#2c3e50",
        highlight: "#34495e"

      }
    ];
    var max = 6;
    var min = 0;

    function getRandomColorFN() {
      var random = Math.floor(Math.random() * (max - min) + min);
      return colors[random];
    }
  }

})();
