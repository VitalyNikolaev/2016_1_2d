define(
    function (require) {
        var Backbone = require('backbone');
        var viewManager = require('views/viewManager');
        var app = require('app');
        
        var views = {
            login: require('views/login'),
            register:  require('views/register'),
            game: require('views/game'),
            scoreboard: require('views/scoreboard'),
            room: require('views/room'),
            main: require('views/main'),
            settings: require('views/settings'),
        };

        var Router = Backbone.Router.extend({
            routes: {
                ':url': 'displayView',
                '*default': 'displayMainView'
            },
            initialize: function () {
                viewManager = new viewManager(views);
            },
            displayMainView: function () {
                views.main.show();
                this.navigate("#main", {trigger: true});
            },
            displayView: function () {
                var view = views[Backbone.history.getFragment()];
                if (view.requireAuth && !app.session.get('authed') ) {
                    this.navigate('#login', {trigger: true});
                    views.login.trigger('error','Need login to perform this action');
                }
                if (Backbone.history.getFragment() === 'game') {
                    if (app.gameReady) {
                        view.show();
                    }
                } else {
                    view.show();
                }
            }
        });

        return new Router();
    }
);