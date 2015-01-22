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

            switch(args.toType){
                case 'private':
                    var toEmit = {
                        "m" : 'msg',
                        "a" : 'add',
                        "d" : {
                            "toType" : 'private',
                            "to" : args[0],
                            "from" : User.get()._id,
                            "date" : Date.now(),
                            "msg" : args.splice(1).join(" ")
                        }
                    };

                    break;
                case 'room':
                    break;

            }
        },

        remove : function(spark, args){

        }
    };


    return new MsgRouter(_s, Primus, spark);
};