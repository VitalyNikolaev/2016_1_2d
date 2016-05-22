define(function (require) {
    var baseView = require('views/baseView');
    var tmpl = require('tmpl/scoreboard');
    var app = require('app');
    var View = baseView.extend({
        template: tmpl,
        collection: app.scoreboard,
        initialize: function () {
            this.render();
            this.listenTo(this.collection, "dataFetched", this.render);
        },
        render: function () {
            this.$el.html(this.template(this.collection.toJSON()));
        }
    });

    return new View();
});