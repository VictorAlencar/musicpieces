requirejs.config({
    baseUrl: 'js',
    paths: {
        'angular': 'lib/angular',
        'angular_audio': 'lib/angular.audio',
        'angular_local_storage': 'lib/angular-local-storage.min',
        'sweetalert': 'lib/sweetalert.min',
        'audioapp': 'page/audioapp'
    },
    shim: {
        'audioapp': {
            deps: ['angular', 'angular_audio', 'angular_local_storage', 'sweetalert']
        },
        'angular_audio': {
            deps: ['angular']
        },
        'angular_local_storage': {
            deps: ['angular']
        }
    }
});

require(['audioapp'], function() {
    angular.bootstrap(document, ['audioApp']);
});