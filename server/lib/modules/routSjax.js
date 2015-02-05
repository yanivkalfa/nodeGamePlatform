module.exports = function(_s, _rf){

    /*
    var router = _rf.Router
        , sJax = _rf.SocketAjax;
    */

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , SocketAjax = require(pathsList.SocketAjax)(_s)
        , RoutSocket = new require(pathsList.RoutSocket)(_s)
        ;


    function RoutSjax (){
        router.apply(this,arguments);
    }

    RoutSjax.prototype = Object.create(router.prototype);
    RoutSjax.prototype.constructor = RoutSjax;

    RoutSjax.prototype.req = function(spark,msg){
        //var RoutSocket = new _s.oModules.RoutSocket(_s.primus);
        console.log('request : ', msg);
        var data = RoutSocket.rout(spark, msg.d);
        var resp = {
            "m":"sjax",
            "d" : {
                "m" : "res",
                "d" : {
                    "id" : msg.id,
                    "d" :  data
                }
            }
        };

        //
        spark.write(resp);
        console.log('spark.write');
        return true;
    };

    RoutSjax.prototype.res = SocketAjax.response.bind(SocketAjax);

    return RoutSjax;
};