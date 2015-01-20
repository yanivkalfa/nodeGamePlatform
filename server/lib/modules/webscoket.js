// export the class
module.exports = function(_s, Primus, spark) {
    function WebSocket(){
        var _this = this;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
        console.log('aaaa');
        this.init();
    }

    WebSocket.prototype = {

        init : function(){
            var self = this;

            self.spark.on('data', function (msg) {
                console.log(msg);
                self[msg.m](self.spark, msg.d);
            });

        }
    };

    return WebSocket;
};

