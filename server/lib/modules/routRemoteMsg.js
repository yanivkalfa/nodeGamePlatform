module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)()
        ;

    function RoutRemoteMsg (){
        router.apply(this,arguments);
    }

    RoutRemoteMsg.prototype = Object.create(router.prototype);
    RoutRemoteMsg.prototype.constructor = RoutRemoteMsg;


    RoutRemoteMsg.prototype.privateMsg = function(spark, msg){
        console.log('private message :', msg);
        var  toSpark;

        toSpark = _s.primus.spark(msg.toSpark);
        if(!toSpark) {
            return {s: false, d : 'We were unable to find this user'};
        }

        var data = {
            "m" : 'msg',
            "d" : {
                "m" : "privateMsg",
                "d" : msg
            }
        };

        delete data.d.d.fromSpark;
        delete data.d.d.toSpark;

        toSpark.write({"m": "chat", "d":data});
        return {s: true, d : 'Message sent successfully'};
    };




    return RoutRemoteMsg;

};