module.exports = function(_s, Primus, spark){

    function Chat (_s, Primus, spark){
        var _ = _s.oReq.lodash;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
    }

    Chat.prototype =  {

        rout: function(msg){
            var self = this;
            self[msg.m](self.spark, msg.d);
        },

        getRooms : function(spark, params){

        },

        join : function(spark, params){

        },

        leave : function(spark, params){

        }
    };


    return new Chat(_s, Primus, spark);
};