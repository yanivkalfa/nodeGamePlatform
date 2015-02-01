module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        , HttpTransit = _rf.HttpTransit
        , Servers = _rf.Servers
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;


    RoutQueue.prototype.privateMsg = function(spark, msg){
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




    return RoutQueue;

};