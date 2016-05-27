define(function(require) {
    var Backbone = require('backbone');
    return function(method, model, options) {
        var methods = {
            'create': {
                send: function() {
                    Backbone.sync('update', model, options);
                }
            },
            'read': {
                send: function() {
                    if (model.url.length == 10) { // GOVNO but works :(
                        model.url += model.get('id');
                    }
                    Backbone.sync(method, model, options);
                },
            },
            
            'update': {
                send: function () {
                    // Backbone.sync('update', model, options);
                }
            }
        };

        return methods[method].send();
    };
});
