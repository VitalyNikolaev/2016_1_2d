define(function (require) {
        var tmpl = require('tmpl/login');
        var baseView = require('views/baseView');
        var app = require('app');
    
        var View = baseView.extend({
            template: tmpl,
            events: {
                'click #sign-in': function(e) {
                    var self = this;
                    e.preventDefault();
                    this.$('.alert-box.error').finish();
                    var login = document.getElementById('login-input').value;
                    var password = document.getElementById('password-input').value;
                    this.$('#sign-in').prop("disabled", true);
                    app.session.save({login: login, password: password}, {
                        success: function() {
                            app.session.set('authed', true);
                            app.user.set('id', app.session.get('id'));
                            app.user.set('isReady', false);
                            app.user.fetch({success: function () {
                                app.Events.trigger('userAuthed');
                                self.reloadAll();
                                window.location.href = '#main'
                            }});
                        },
                        error : function (err, text) {
                            self.showErrorMessage(text.responseJSON.message);
                        }
                    });
                }
            },
            initialize: function () {
                this.render();
                this.on('error', this.showErrorMessage);
                this.listenTo(app.user, "invalidLoginPassword", this.showErrorMessage);
                this.listenTo(app.user, 'userAuthed', this.reloadAll);
            },
            reloadAll: function() {
                this.$('#sign-in').prop("disabled", false);
                if(document.getElementById('login-input')) {
                    document.getElementById('login-input').value = "";
                    document.getElementById('password-input').value = "";
                }

            },
            showErrorMessage: function (msg) {
                this.$('.alert-box.error').html('Error: ' + msg).fadeIn(400,function(){
                    $('#sign-in').prop("disabled", false);
                }).fadeOut(2200);

            }
        });

        return new View();
    }
);