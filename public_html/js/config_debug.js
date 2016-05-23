var require = {
    urlArgs: '_=' + (new Date()).getTime(),
    baseUrl: 'js',
    paths: {
        underscore: 'lib/underscore',
        jquery: 'lib/jquery',
        backbone: 'lib/backbone',
        three : 'lib/three.min',
        OBJLoader: 'lib/OBJLoader',
        MTLLoader: 'lib/MTLLoader',
        webcam : 'lib/webcam.min',
        OrbitControls : 'lib/OrbitControls'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'jquery': {
            exports: 'jquery'
        },
        'underscore': {
            exports: '_'
        },
        'three': {
            exports: 'three'
        },
        'OBJLoader': {
            deps: ['three'],
            exports: 'OBJLoader'
        },
        'MTLLoader': {
            deps: ['three'],
            exports: 'MTLLoader'
        },
        'webcam': {
            exports: 'webcam'
        },
        'OrbitControls': {
            deps: ['three'],
            exports: 'OrbitControls'
        }

    }
};