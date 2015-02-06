module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        ;

    function RoutRemoteMsg (){
        router.apply(this,arguments);
    }

    RoutRemoteMsg.prototype = Object.create(router.prototype);
    RoutRemoteMsg.prototype.constructor = RoutRemoteMsg;


    RoutRemoteMsg.prototype.privateMsg = function(spark, msg){
        console.log('private message :', msg);
        var  toSpark, sjaxRes, data;

        sjaxRes = {
            "m":"sjax",
            "d" : {
                "m" : "res",
                "d" : {
                    "id" : msg.id,
                    "d" :  {}
                }
            }
        };

        toSpark = _s.primus.spark(msg.toSpark);
        if(!toSpark) {
            sjaxRes.d.d.d = {s: false, d : 'We were unable to find this user'};
            spark.write(sjaxRes);
            return
        }

        data = {
            "m" : 'msg',
            "d" : {
                "m" : "privateMsg",
                "d" : msg
            }
        };

        delete data.d.d.fromSpark;
        delete data.d.d.toSpark;

        toSpark.write({"m": "chat", "d":data});
        sjaxRes.d.d.d  = {s: true, d : 'Message sent successfully'};



        spark.write(sjaxRes);
    };




    return RoutRemoteMsg;

};