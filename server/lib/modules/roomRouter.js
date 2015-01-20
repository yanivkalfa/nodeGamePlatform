module.exports = function(){

    function RoomRouter (_s, Primus, spark){
        var _ = _s.oReq.lodash;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
    }

    RoomRouter.prototype =  {

        rout: function(args){
            var self = this;
            self[args.action](self.spark, args.params);
        },

        getRooms : function(spark, params){

        },

        join : function(spark, params){

        },

        leave : function(spark, params){

        }
    };


    return RoomRouter;
};