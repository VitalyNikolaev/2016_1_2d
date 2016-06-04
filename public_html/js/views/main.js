define(function (require) {
        var baseView = require('views/baseView');
        var tmpl = require('tmpl/main');
        var app = require('app');
        var $ = require('jquery');

        var View = baseView.extend({
            template: tmpl,
            events: {
                'click #logout': function(e) {
                    var self = this;
                    e.preventDefault();
                    app.session.destroy({
                        success: function () {
                            app.createNewSession();
                            self.reloadView();
                        }
                    });
                },
                'click #asGuest': function(e) {
                    e.preventDefault();
                    this.makeGuestAccout();
                }
            },
            initialize: function () {
                this.render();
                this.listenTo(app.Events, "userAuthed", this.reloadViewWithAuthTemplate);
                this.listenTo(app.Events, "showError", this.showErrorMessage);

            },
            makeGuestAccout: function () {
                var self = this;
                var prevName = '';
                function generateRandomUser() {
                    $(".spinner").fadeIn('fast');
                    $(".preloader").fadeIn('fast');
                    $.ajax({
                        url: 'http://uinames.com/api/?maxlen=10&region=england&gender=male'
                    }).done(function (data) {
                        app.user.save({isGuest: true, login: data.name + prevName, password: self.generateRandomPassword()}, {
                            success: function () {
                                app.session.set('authed', true);
                                app.user.fetch({
                                    success: function () {
                                        app.Events.trigger('userAuthed');
                                        window.location.href = '#main';
                                        var start = new Date().getTime();
                                        this.$(".logo--avatar").load(function() {
                                            var criticalTime = 500;
                                            var fadeTime = criticalTime;
                                            if (new Date().getTime() - start > criticalTime) {
                                                fadeTime = 0;
                                            }
                                            $(".spinner").delay(fadeTime).fadeOut('fast');
                                            $(".preloader").delay(fadeTime + 400).fadeOut('fast');
                                        });
                                    }
                                });
                            },
                            error: function (err) {
                                if (prevName == '') {
                                    prevName = data.name;
                                }
                                generateRandomUser();
                            }
                        });
                    });
                }
                generateRandomUser();
            },

            reloadViewWithAuthTemplate: function() {
                app.fetchUserAvatarOrGetRandom();
                this.template = require('tmpl/main_authed');
                this.render();
                this.$(".logo--avatar").attr("src", app.avatarSrc);
            },
            reloadView: function() {
                this.template = tmpl;
                this.render();
            },
            render: function () {
                this.$el.html(this.template(app.user.toJSON()));
            },
            showErrorMessage: function (msg) {
                this.$('.alert-box.error').html('Error: ' + msg).fadeIn(800,function() {
                }).fadeOut(3200);
            },
           generateRandomPassword: function() {
                var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
                var pass = "";
                for (var x = 0; x < 6; x++) {
                    var i = Math.floor(Math.random() * chars.length);
                    pass += chars.charAt(i);
                }
                return pass;
                }
        });

        return new View();
    }

);