module.exports = function(_s){

    function Router (Primus, spark){
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
    }

    Router.prototype =  {

        rout: function(spark, msg){
            var self = this;
            console.log(msg);
            self[msg.m](self.spark, msg.d);
        }
    };


    return Router;
};