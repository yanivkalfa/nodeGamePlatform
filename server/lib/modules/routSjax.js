module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , SocketAjax = _s.oSocketAjax
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
        RoutSocket.rout(spark, msg.d, msg.id);
        return true;
    };

    RoutSjax.prototype.res = SocketAjax.response.bind(SocketAjax);

    return RoutSjax;
};