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
                $.ajax({
                    url: 'http://uinames.com/api/'
                }).done(function (data) {
                    app.user.save({login: data.name, password: data.name}, {
                        success: function () {
                            app.session.set('authed', true);
                            app.user.fetch({
                                success: function () {
                                    app.Events.trigger('userAuthed');
                                    window.location.href = '#main'
                                }
                            });
                        }
                    });
                });
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
            }
        });

        return new View();
    }

);