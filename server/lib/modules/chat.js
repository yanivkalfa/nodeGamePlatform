module.exports = function(_s, Primus, spark){

    function Chat (_s, Primus, spark){
        var _ = _s.oReq.lodash;
        this._s = _s;
        this.Primus = Primus;
        this.spark = spark;

        this.msgRouter = _s.oModules.msgRouter(_s, _s.primus, spark);
        this.roomRouter = _s.oModules.roomRouter(_s, _s.primus, spark);

        console.log(this.msgRouter);
    }

    Chat.prototype =  {

        rout: function(msg){
            var self = this;
            self[msg.m](self.spark, msg);
        },

        msg : function(msg){
            this.msgRouter.rout(msg);
        },
        roomDo : function(msg){
            this.roomRouter.rout(msg);
        }
    };


    return new Chat(_s, Primus, spark);
};