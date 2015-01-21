module.exports = function(_s, Primus, spark){

    function MsgRouter (_s, Primus, spark){
        var _ = _s.oReq.lodash;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;
    }

    MsgRouter.prototype =  {

        rout: function(msg){
            var self = this;
            self[msg.a](self.spark, msg);
        },

        add : function(spark, args){



            _s.primus.forEach(function (spark, next) {
                if(spark.userId == req.session.user.id){
                    spark.end();
                    next(undefined, false);
                }else{
                    next();
                }
            }, function (err) {
                req.session.user = {};
            });
        },

        remove : function(spark, args){

        }
    };


    return new MsgRouter(_s, Primus, spark);
};