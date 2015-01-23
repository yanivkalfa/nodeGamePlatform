module.exports = function(_s){

    function Router (Primus, spark){
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
    }

    Router.prototype =  {

        rout: function(msg){
            var self = this;
            self[msg.m](self.spark, msg);
        }
    };


    return Router;
};