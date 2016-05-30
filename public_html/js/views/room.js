define(function (require) {
    var baseView = require('views/baseView');
    var app = require('app');
    var tmpl = require('tmpl/room');
    var ws = require('utils/ws');
    var roomCollection = require('collections/room');
    var roomPlayer = require('views/room-player');
   
    var View = baseView.extend({
        template: tmpl,
        requireAuth: true,
        pingTimer: null,
        currentPlayer: null,
        events: {
            'click .room__wrapper__user-ready-btn': function(e) {
                if (this.currentPlayer.get('isReady') == false && ws.socket.readyState != 3) {
                    ws.sendReady(true, app.user.get('contentLoaded'));
                    this.currentPlayer.set('isReady', true);
                    $('.room__wrapper__user-ready-btn')
                        .html('Not Ready?')
                        .css('background-color', '#FF9800');
                } else {
                    if (this.currentPlayer.get('isReady') == true && ws.socket.readyState != 3) {
                        this.currentPlayer.set('isReady', false);
                        ws.sendReady(false, app.user.get('contentLoaded'));
                        $('.room__wrapper__user-ready-btn')
                            .html('Set Ready')
                            .css('background-color', '#039BE5');
                    } else {
                        this.$('.alert-box.error').finish();
                        this.showErrorMessage('Connection error, reenter room');
                    }
                }
            },
            'click .room__wrapper__btn-back': function (e) {
                this.currentPlayer = null;
                app.Events.trigger('needToReloadGame');
                if(ws.socket.readyState != 3) {
                    ws.closeConnection();
                    clearInterval(this.pingTimer);
                    this.collection.destroyAllModels();
                }
            }
        },
        initialize: function () {
            this.render();
            this.collection = new roomCollection();
            this.listenTo(this.collection, "add", this.addUser);
            this.listenTo(app.wsEvents, "world_created" , this.startGame)
            
        },
        show: function () {
            baseView.prototype.show.call(this);
            ws.startConnection();
            this.pingTimer = setInterval(function () {
                ws.sendPing()
            }, 15000);
        },
        hide: function () {
            if(this.pingTimer != null) {
                clearInterval(this.pingTimer)
            }
            this.currentPlayer = null;
            $('.room__wrapper__user-ready-btn')
                .html('Set Ready')
                .css('background-color', '#039BE5');
            this.collection.destroyAllModels();
            baseView.prototype.hide.call(this);
        },
        showErrorMessage: function (msg) {
            this.$('.alert-box.error').html('Error: ' + msg).fadeIn(400,function(){
            }).fadeOut(2200);
        },
        addUser: function(userModel) {
            var playerView = new roomPlayer({'model': userModel});
            this.$('.room__players-wrapper').append(playerView.el);
            if (userModel.get('id') === app.user.get('id')) {
                this.currentPlayer = userModel;
                this.listenTo(app.user, "change:contentLoaded", this.checkContentLoadedStatus);
            }
            this.listenToOnce(playerView, "removeMe", this.removeUser);
        },
        removeUser: function(user) {
            user.remove();
            if (user.model == this.currentPlayer && app.gameReady == false) {
                app.Events.trigger('needToReloadGame');
                app.Events.trigger('showError','You was kicked for being AFK');
                window.location.href = '#main';
            }
        },
        checkContentLoadedStatus: function (data) {
          if (this.currentPlayer !== null && this.currentPlayer.get('isReady')) {
              ws.sendReady(true, app.contentLoaded);
          }
        },
        startGame: function (data) {
            app.gameReady = true;
            this.collection.destroyAllModels();
            window.location.href = '#game';
        }
    });
    return new View();

});