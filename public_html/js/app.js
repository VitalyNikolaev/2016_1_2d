define(
    function (require) {
        var Backbone = require('backbone');
        var session = require('models/session');
        var user = require('models/user');
        var scoreBoard = require('collections/scoreboard');
        
        var app = {
            session: new session(),
            scoreboard: new scoreBoard(),
            user: new user(),
            host: 'localhost',
            avatarSrc: 'https://api.adorable.io/avatars/130/random',
            gameReady: false,
            createNewSession : function () {
                app.session = new session();
                app.user = new user();
                app.user.set('contentLoaded', false);
                app.session.set('id', -1);
            },
            fetchUserAvatarOrGetRandom: function(){
                if (app.user.get('userpic_path') !== null) {
                    app.avatarSrc = app.user.userpic_path
                } else {
                    app.avatarSrc = 'https://api.adorable.io/avatars/130/' + app.user.get('login')
                }
            },
            fetchNewScoreboard: function () {
                this.scoreboard.fetchNewData();
            }
        };
        app.user.set('contentLoaded', false);
        app.session.fetch({
            success: function() {
                app.session.set('authed', true);
                app.user.set('id', app.session.get('id'));
                app.user.set('isReady', false);
                app.user.fetch({
                    success: function () {
                        app.Events.trigger('userAuthed');
                }});
            },
            error: function () {
                app.session.set('id', -1);
            }
        });


        app.Events = new _.extend({}, Backbone.Events);
        app.wsEvents = new _.extend({}, Backbone.Events);
        

        return app
});