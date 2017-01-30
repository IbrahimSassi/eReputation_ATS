(function () {
    'use strict';

    angular
        .module('ATSApp.user')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$resource'];

    /* @ngInject */
    function UserFactory($resource) {

        /** Change The Link To your Rest URL From the JAVA EE APP*/
        return $resource('https://jsonplaceholder.typicode.com/posts/:id',

            {id: '@id'},
            {
                'update': {method: 'PUT'}
            }
        );


    }

})();