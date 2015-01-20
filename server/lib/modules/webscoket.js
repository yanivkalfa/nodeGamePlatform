// export the class
module.exports = function() {
    function WebSocket(_s, Primus, spark){
        var _this = this;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
        this.init();

        setInterval(function(){
            _this.AnotherPrototype();
        },1000);
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

