module.exports = function(_s, _rf){

    var router = _rf.Router
        , sJax = _rf.SocketAjax;


    function RoutSjax (){
        router.apply(this,arguments);
    }

    RoutSjax.prototype = Object.create(router.prototype);
    RoutSjax.prototype.constructor = RoutSjax;

    RoutSjax.prototype.req = function(spark,msg){
        var RoutSocket = new _s.oModules.RoutSocket(_s.primus);
        var data = RoutSocket.rout(spark, msg);
        console.log('request : ', msg);
        var resp = {
            "m":"sjax",
            "d" : {
                "m" : "res",
                "d" : {
                    "id" : msg.id,
                    "d" :  {s: true, d :'Some error happened'}
                }
            }
        };
        spark.write(resp);
        console.log('spark.write');
        return true;
    };

    RoutSjax.prototype.res = sJax.response.bind(sJax);

    return RoutSjax;
};