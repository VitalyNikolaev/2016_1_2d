define(function (require) {
        var tmpl = require('tmpl/register');
        var baseView = require('views/baseView');
        var app = require('app');
        var View = baseView.extend({
            template: tmpl,
            events: {
                'click #sign-up': function(e) {
                    e.preventDefault();
                    var self = this;
                    this.$('.alert-box.error').finish();
                    var login = document.getElementById('reg-login-input').value;
                    var password = document.getElementById('reg-password-input').value;
                    app.user.save({login: login, password: password}, {
                        success: function() {
                            app.session.set('authed', true);
                            app.user.fetch({success: function () {
                                app.user.set('isReady', false);
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
                this.listenTo(app.user, "invalidForm", this.showErrorMessage);
            },
            reloadAll: function() {
                this.$('#sign-up').prop("disabled", false);
                document.getElementById('reg-login-input').value = "";
                document.getElementById('reg-password-input').value = "";
            },
            showErrorMessage: function (msg) {
                this.$('.alert-box.error').html('Error: ' + msg).fadeIn(400,function(){
                    $('#sign-up').prop("disabled", false)}).fadeOut(2200);
            }

        });

        return new View();
    }
);