(function () {
    'use strict';

    angular
        .module('ATSApp.dashboard')
        .service('DashboardService', DashboardServiceFN);

  DashboardServiceFN.$inject = ['DashboardFactory'];


    function DashboardServiceFN(DashboardFactory) {


        this.getAllUsers = function () {

            return DashboardFactory.query().$promise;

        }


    }


})();

