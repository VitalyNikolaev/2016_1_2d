define(function(require) {
    var Backbone = require('backbone');
    var scores = require('models/scores');
    var $ = require('jquery');

    return Backbone.Collection.extend({
        model: scores,
        url: '/api/user/top10',
        comparator: function(item) {
            return -item.get('score');
        },
        initialize: function () {
          this.fetchNewData();
        },
        fetchNewData: function () {
            var self = this;
            $.ajax({
                url: '/api/user/top10'
            }).done(function(data) {
                self.set(data);
                self.trigger('dataFetched')
            });  
        }
    });
});
