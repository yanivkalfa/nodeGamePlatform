module.exports = function(_s, _rf){

    var router = _rf.Router
        , sJax = _s.oModules.SocketAjax;

    function RoutSjax (){
        router.apply(this,arguments);
        this.RoutChat = new _rf.RoutChat();
    }

    RoutSjax.prototype = Object.create(router.prototype);
    RoutSjax.prototype.constructor = RoutSjax;

    RoutSjax.prototype.req = function(spark,msg){

        var data = this.RoutChat.rout(spark, msg);
        var resp = {
            "m":"sJax",
            "d" : {
                "m" : "res",
                "d" : {
                    "id" : msg.id,
                    "d" :  {s: true, d :data}
                }
            }
        };
        spark.write(resp);
    };

    RoutSjax.prototype.res = sJax.response;

    return RoutSjax;
};