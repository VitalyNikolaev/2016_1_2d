define(function (require) {
    QUnit.module("views/manager");

    QUnit.test("ViewManager - экземпляр Backbone.View", function () {

        var ViewManager = require('views/viewManager');
        var viewManager = new ViewManager();

        QUnit.ok(viewManager instanceof Backbone.View);

    });

    QUnit.test("Logic test for ViewManager", function () {
        var ViewManager = require('views/viewManager');
       
        var views = {
                login: require('views/login'),
                reg: require('views/register')
            };
        var viewManager = new ViewManager(views);

        QUnit.equal(views['login'].$el.css('display') === 'none', true);
        QUnit.equal(views['reg'].$el.css('display') === 'none', true);
        
        views['login'].show();
        
        QUnit.equal(views['login'].$el.css('display') === 'none', false);
        QUnit.equal(views['reg'].$el.css('display') === 'none', true);
        
        views['reg'].show();
        
        QUnit.equal(views['login'].$el.css('display') === 'none', true);
        QUnit.equal(views['reg'].$el.css('display') === 'none', false);

    });

});