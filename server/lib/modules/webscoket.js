// export the class
module.exports = function() {
    /*
    function WebSocket(_s, Primus, spark){
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
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
    };*/

    return {
        init : function(_s, Primus, spark){
            var self = this;

            spark.on('data', function (msg) {
                console.log(msg);
                self[msg.m](spark, msg.d);
            });
        }
    };
};

