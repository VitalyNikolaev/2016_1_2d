define(function(require) {
    var Backbone = require('backbone');
    var scores = require('models/scores');
    var app = require('app');
    var Player = require('models/roomPlayer');
    
    var Collection = Backbone.Collection.extend({
        model: Player,
        comparator: function(score) {
            return -score.get('rating');
        },
        initialize: function () {
            this.listenTo(app.wsEvents, "user_joined", this.onNewUserJoined);
            this.listenTo(app.wsEvents, "user_left", this.onUserLeft);
            this.listenTo(app.wsEvents, "user_state_changed", this.onUserStateChanged);
        },
        destroyAllModels: function () {
            this.remove(this.toArray());
        },
        onNewUserJoined: function(userData) {
            this.add(new Player(userData));
        },
        onUserLeft: function(data) {
            this.remove(this.where({id: data.id}));
        },
        onUserStateChanged: function(data) {
            var player = this.where({id: data.id});
            player[0].set("isReady", data.isReady);
        },

    });


    return Collection;
});
