define(function (require) {
    var Scoreboard = require('collections/scoreboard');
    var baseView = require('views/baseView');
    var tmpl = require('tmpl/scoreboard');
    var View = baseView.extend({
        template: tmpl,
        collection: new Scoreboard(),
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