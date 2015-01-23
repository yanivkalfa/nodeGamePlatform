module.exports = function(_s, _rf){

    var router = _rf.Router
        , User = _rf.User
        ;

    function RoutMsg (){
        router.apply(this,arguments);
    }

    RoutMsg.prototype = Object.create(router.prototype);
    RoutMsg.prototype.constructor = RoutMsg;

    RoutMsg.prototype.add = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , cName
            , prvSuccess
            , prvFail
            , data
            ;

        switch(msg.toType){
            case 'private':

                prvSuccess = function(user){
                    cName = 'u_' + user.id;
                    data = {
                        "m" : 'msg',
                        "d" : {
                            "m" : "add",
                            "d" : {
                                id : dateNow + randomId.toString(),
                                "toType" : 'private',
                                "to" : user.id,
                                "from" : User.get().username,
                                "date" : dateNow,
                                "msg" : msg.msg
                            }
                        }
                    };
                    _s.primus.room(cName).write({"m": "chat", "d":data});
                };

                prvFail = function(user){
                    //"toType" : "warning",
                };

                User.fetchUser(msg.to).then(prvSuccess).catch(prvFail);

                break;
            case 'room':
                break;

        }
    };

    RoutMsg.prototype.remove = function(spark, msg){

    };


    return RoutMsg;
};