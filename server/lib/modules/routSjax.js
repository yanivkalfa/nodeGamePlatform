module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)()
        , SocketAjax = require(pathsList.SocketAjax)(_s)
        ;


    function RoutSjax (){
        router.apply(this,arguments);
    }

    RoutSjax.prototype = Object.create(router.prototype);
    RoutSjax.prototype.constructor = RoutSjax;

    RoutSjax.prototype.req = function(spark,msg){
        var routSocket = require(pathsList.RoutSocket)(_s);
        var RoutSocket = new routSocket();
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

        spark.write(resp);
        console.log('spark.write');
        return true;
    };

    RoutSjax.prototype.res = SocketAjax.response.bind(SocketAjax);

    return RoutSjax;
};