//DEPRECATED
define(function (require) {
        var tmpl = require('tmpl/settings');
        var baseView = require('views/baseView');
        var camera = require('webcam');
        var app = require('app');

        var View = baseView.extend({
            template: tmpl,
            requireAuth: true,
            cameraAdded: false,
            events: {
                'click .change-avatar': function(e) {
                    this.$('.webcam__snapshot').fadeIn(600);
                    this.addCamera();
                    this.cameraAdded = true;
                },
                'click .snapshot__button': function (e) {
                    this.takeSnapshot();
                },
                'click .snapshot__button_finish': function (e) {
                    this.$('.webcam__snapshot').fadeOut(0);
                    this.$('#webcam-monitor').height(0);
                    this.removeCamera();
                    this.cameraAdded = false;
                }
            },
            initialize: function () {
                this.listenTo(app.Events, "userAuthed", this.render);
                this.render();
            },
            render: function () {
                this.$el.html(this.template(app.user.toJSON()));
                this.$(".logo--avatar").attr("src", app.avatarSrc);
            },
            hide: function () {
                if (this.$('.webcam__snapshot').css('display') != 'none' && this.cameraAdded) {
                    this.$('.webcam__snapshot').fadeOut(0);
                    this.$('#webcam-monitor').height(0);
                    this.removeCamera();
                    this.cameraAdded = false;
                }
                baseView.prototype.hide.call(this);
            },
            addCamera: function () {
                camera.set({
                    width: 240,
                    height: 240,
                    dest_width: 160,
                    dest_height: 140,
                    image_format: 'jpeg',
                    jpeg_quality: 100,
                    flip_horiz: false,
                    force_flash: true,
                    fps: 50
                });
                camera.attach(this.$('#webcam-monitor')[0]);
            },
            takeSnapshot: function () {
                camera.snap( function(data_uri) {
                    document.getElementById('user_avatar').innerHTML = '<img src="'+data_uri+'"/>';
                } );
            },
            removeCamera : function () {
                camera.reset();
            }
        });

        return new View();
    }
);