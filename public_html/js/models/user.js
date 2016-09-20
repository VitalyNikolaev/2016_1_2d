define(function(require) {
        var Backbone = require('backbone');
        var userSync = require('syncs/userSync');
        var User = Backbone.Model.extend({
            sync: userSync,
            url: '/api/user/',
            validate: function(attrs, options) {
                if (attrs.login.length === 0 || attrs.password.length === 0 ) {
                    this.trigger('invalidForm', 'Please enter valid data');
                    return "Validation error";
                }
                if (attrs.login.length > 16 ) {
                    this.trigger('invalidForm', 'Username too big');
                    return "Validation error";
                }
            }
        });

        return User;
});