define(function(require) {
    var Backbone = require('backbone');
    var sessionSync = require('syncs/sessionSync');
    var Session = Backbone.Model.extend({
        url: '/api/session/',
        sync: sessionSync
    });
    return Session
});