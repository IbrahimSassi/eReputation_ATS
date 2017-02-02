(function () {
    'use strict';

    angular
        .module('ATSApp.dashboard')
        .factory('DashboardFactory', DashboardFactory);

  DashboardFactory.$inject = ['$resource'];

    /* @ngInject */
    function DashboardFactory($resource) {

        /** Change The Link To your Rest URL From the JAVA EE APP*/
        return $resource('https://jsonplaceholder.typicode.com/posts/:id',

            {id: '@id'},
            {
                'update': {method: 'PUT'}
            }
        );


    }

})();
