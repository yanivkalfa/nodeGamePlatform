module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        , HttpTransit = _rf.HttpTransit
        , Servers = _rf.Servers
        ;

    function RoutRemoteMsg (){
        router.apply(this,arguments);
    }

    RoutRemoteMsg.prototype = Object.create(router.prototype);
    RoutRemoteMsg.prototype.constructor = RoutRemoteMsg;

    RoutRemoteMsg.prototype.warningMsg = function(spark, msg){
        /*
        var toSpark;
        msg.m = 'msg';
        delete msg.d.d.fromSpark;
        delete msg.d.d.toSpark;
        toSpark = _s.primus.spark(msg.fromSpark);
        toSpark.write({"m": "chat", "d":msg});
        */
    };

    RoutRemoteMsg.prototype.privateMsg = function(spark, msg){
        /*
        var  toSpark;

        console.log('privateMsg', msg);
        toSpark = _s.primus.spark(msg.toSpark);
        if(!toSpark) {
            var RoutMsg = new _rf.RoutMsg();
            RoutMsg.warningMsg(spark, msg,'Could not find socket');
            spark.end();
            return
        }

        msg.m = 'msg';
        delete msg.d.d.fromSpark;
        delete msg.d.d.toSpark;

        toSpark.write({"m": "chat", "d":msg});
        spark.end();*/
    };




    return RoutRemoteMsg;

};