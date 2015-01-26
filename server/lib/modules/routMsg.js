module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        ;

    function RoutMsg (){
        router.apply(this,arguments);
    }

    RoutMsg.prototype = Object.create(router.prototype);
    RoutMsg.prototype.constructor = RoutMsg;

    RoutMsg.prototype.warningMsg = function(spark, injectedMsg, naturalMsg){
        var warningMsg = _.isEmpty(naturalMsg) || typeof naturalMsg === 'object' ? injectedMsg : naturalMsg;

        var randomId = Math.floor(Math.random()*300000)
            , dateNow = Date.now()
            , data  = {
                "m" : 'msg',
                "d" : {
                    "m" : 'warningMsg',
                    "d" : {
                        "id" : dateNow + randomId.toString(),
                        "action" : "add",
                        "toType" : 'warning',
                        "to" : {id : spark.user.id, username : spark.user.username},
                        "from" : {id : spark.user.id, username : 'System'},
                        "date" : dateNow,
                        "content" : warningMsg
                    }
                }
            };

        spark.write({"m": "chat", "d":data});
    };
    RoutMsg.prototype.privateMsg = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , cName
            , prvSuccess
            , data
            , self = this
            ;

        prvSuccess = function(user){
            if(user.id == msg.to.id) return self.warningMsg(spark, 'You cannot Message yourself');

            cName = 'u_' + user.id;
            data = {
                "m" : 'msg',
                "d" : {
                    "m" : "privateMsg",
                    "d" : {
                        id : dateNow + randomId.toString(),
                        "action" : 'add',
                        "toType" : 'private',
                        "to" : {id:user.id, username: user.username},
                        "from" : {id : spark.user.id, username : spark.user.username},
                        "date" : dateNow,
                        "content" : msg.content
                    }
                }
            };
            spark.write({"m": "chat", "d":data});
            _s.primus.room(cName).write({"m": "chat", "d":data});
        };

        User.fetchUser(msg.to).then(prvSuccess).catch(self.warningMsg.bind(self, spark, 'User with this name does not exist'));
    };

    RoutMsg.prototype.publicMsg = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , data
            ;

        data = {
            "m" : 'msg',
            "d" : {
                "m" : "publicMsg",
                "d" : {
                    id : dateNow + randomId.toString(),
                    "action" : msg.action,
                    "toType" : 'public',
                    "to" : {'id' : msg.to},
                    "from" : {id : spark.user.id, username : spark.user.username},
                    "date" : dateNow,
                    "content" : msg.content
                }
            }
        };

        if(msg.action == 'remove'){
            data.d.d.id = msg.id;
            delete data.d.d.date;
            delete data.d.d.content;
        }

        console.log(msg);
        _s.primus.room(msg.to).write({"m": "chat", "d":data});

    };


    return RoutMsg;
};