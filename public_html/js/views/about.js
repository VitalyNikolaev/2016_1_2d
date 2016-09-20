/**
 * Created by nikolaev on 26.05.16.
 */
define(function (require) {
    var tmpl = require('tmpl/about');
    var baseView = require('views/baseView');

    var View = baseView.extend({
        template: tmpl
        
    });
    return new View();
});