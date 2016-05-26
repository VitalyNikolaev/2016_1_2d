define(function(require) {
    var app = require('app');
    
    var wsApi = {
        WS_URL: 'ws://' + app.host + '/game',
        socket: null,
        startConnection: function() {
            this.socket  = new WebSocket(this.WS_URL);
            this.socket.onopen = this.onOpen;
            this.socket.onclose = this.onClose;
            this.socket.onerror = this.onError;
            this.socket.onmessage = this.onMessage;
            this.socket.onmessage = this.onMessage;
        },
        closeConnection: function() {
            this.socket.close();
        },
        onOpen: function() {

        },
        onClose: function(code) {
            console.log("CLOSE SOCKET:");
            console.log(code);
        },
        onMessage: function (event) {
            var dataObj = JSON.parse(event.data);
            app.wsEvents.trigger(dataObj.type, dataObj);
        },
        onError: function(error) {
            console.log("SOCKET ERROR: " + JSON.stringify(error));
        },
        sendReady: function(readyStatus, contentStatus) {
            var data = {
                "type": "user_state_changed",
                "isReady": readyStatus,
                "contentLoaded": true
            };
            this.socket.send(JSON.stringify(data));
        },
        sendPing: function () {
            var data = {
                "type": "ping"
            };
            if(this.socket.readyState != 3) {
                this.socket.send(JSON.stringify(data));
            }
        },
        sendMessage: function (data) {
            this.socket.send(JSON.stringify(data));
        }
    };
    return wsApi;

});