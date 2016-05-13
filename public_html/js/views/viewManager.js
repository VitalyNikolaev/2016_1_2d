define(function(require){
    var Backbone = require('backbone');

    var ViewManager = Backbone.View.extend({
        el: '#page',
        initialize: function (views) {
            this.views = views;
            this.hideViews();
            for (var view in this.views) {
                this.$el.append(this.views[view].el);
                this.listenTo(this.views[view], 'show', this.hideViews);
            }
        },
        hideViews: function () {
            for (var view in this.views) {
                this.views[view].hide();
            }
        }

    });
    return  ViewManager;
});
