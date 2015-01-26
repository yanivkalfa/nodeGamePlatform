module.exports = function(_s, _rf){

    var router = _rf.Router
        , User = _rf.User
        ;

    function RoutMsg (){
        router.apply(this,arguments);
    }

    RoutMsg.prototype = Object.create(router.prototype);
    RoutMsg.prototype.constructor = RoutMsg;

    RoutMsg.prototype.warningMsg = function(spark, warningMsg){
        var randomId = Math.floor(Math.random()*300000)
            , dateNow = Date.now()
            , data  = {
                "m" : 'msg',
                "d" : {
                    "m" : 'warningMsg',
                    "d" : {
                        "id" : dateNow + randomId.toString(),
                        "action" : "add",
                        "to" : {id : spark.user.id, username : spark.user.username},
                        "from" : "System",
                        "date" : dateNow,
                        "msg" : warningMsg
                    }
                }
            };

        spark.write({"m": "chat", "d":data});
    };

    //{id:'', date : '', formatDate : '', action:'', from : '', to : '', content: ''}
    RoutMsg.prototype.privateMsg = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , cName
            , prvSuccess
            , prvFail
            , data
            , self = this
            ;

        prvSuccess = function(user){
            cName = 'u_' + user.id;
            data = {
                "m" : 'msg',
                "d" : {
                    "m" : "privateMsg",
                    "d" : {
                        id : dateNow + randomId.toString(),
                        "action" : 'add',
                        "to" : {id:user.id, username: user.username},
                        "from" : {id:spark.id, username: spark.username},
                        "date" : dateNow,
                        "content" : msg.content
                    }
                }
            };
            _s.primus.room(cName).write({"m": "chat", "d":data});
        };

        User.fetchUser(msg.to).then(prvSuccess).catch(self.warningMsg.bind(spark));
    };

    RoutMsg.prototype.publicMsg = function(spark, msg){
        var data  = {
            "m" : 'msg',
            "d" : {
                "m" : method,
                "d" : {
                    "id" : id,
                    "action" : action,
                    "to" : args[0],
                    "from" : Authorization.getUser().id,
                    "content" : args.splice(1).join(" ")
                }
            }
        };

        //{id:'', date : '', formatDate : '', action:'', from : '', to : '', content: ''}
    };


    return RoutMsg;
};