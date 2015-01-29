module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        , HttpTransit = _rf.HttpTransit
        , Servers = _rf.Servers
        ;

    function RoutMsg (){
        router.apply(this,arguments);
    }

    RoutMsg.prototype = Object.create(router.prototype);
    RoutMsg.prototype.constructor = RoutMsg;

    RoutMsg.prototype.warningMsg = function(spark, msg, warningMsg){
        warningMsg = (warningMsg) ? warningMsg : msg;
        var randomId = Math.floor(Math.random()*300000)
            , dateNow = Date.now()
            , data
            ;

        data  = {
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

        if(msg.fromSpark){
            data.m = 'rmMsg';
            data.d.d.fromSpark = msg.fromSpark;
            data.d.d.toSpark = msg.toSpark;
            spark.write({"m": "chat", "d":data});
            spark.end();
            return true;
        }


        spark.write({"m": "chat", "d":data});
    };

    RoutMsg.prototype.privateMsg = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , cName
            , prvSuccess
            , data
            , self = this
            , serverDetails
            , toSpark
            , Socket
            , client
            ;

        prvSuccess = function(user){
            if(!user) return self.warningMsg(spark, 'User with this name does not exist');
            if(user.username == msg.to) return self.warningMsg(spark, 'You cannot Message yourself');

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

            toSpark = _s.primus.spark(user.spark);
            if(toSpark){
                console.log('spark on server');
                spark.write({"m": "chat", "d":data});
                toSpark.write({"m": "chat", "d":data});
                return true;
            }

            _s.primus.metroplex.spark(user.spark, function (err, server) {
                if(!server || server.port || server.address) return self.warningMsg(spark, 'We were unable to find this user');
                console.log('metroplex server:', server);
                serverDetails = Servers.parseAddress(server);
                HttpTransit.login(serverDetails).then(function(user){
                    console.log('login user: ', user);

                    Socket = _s.primus.Socket;
                    client = new Socket(serverDetails.address + ':' + serverDetails.port + '/?token=' + user.token);
                    client.on('open', function open() {
                        spark.write({"m": "chat", "d":data});

                        data.m = 'rmMsg';
                        data.d.d.fromSpark = spark.id;
                        data.d.d.toSpark = user.spark;
                        client.write({"m": "chat", "d":data});
                    });
                });
            });
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