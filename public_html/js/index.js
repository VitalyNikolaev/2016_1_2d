define(function (require) {
    var Backbone = require('backbone');
    var app = require('app');
    var router = require('router');
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('serviceWorker.js').then(function(reg) {
    //         console.log('Registration succeeded. Scope is ' + reg.scope);
    //     }).catch(function(error) {
    //         console.log('Registration failed with ' + error);
    //     });
    // }
    Backbone.history.start();
});

