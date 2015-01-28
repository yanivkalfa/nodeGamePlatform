
module.exports = function(_s){
    var _ = _s.oReq.lodash,
        sessCon = _s.oConfig.session.connection,
        sessSecret = _s.oConfig.session.secret,
        primusOptions = {
            cluster: {
                redis: {
                    port: _s.oConfig.connections[sessCon].port,
                    host: _s.oConfig.connections[sessCon].host,
                    connect_timeout: 200
                }
            },
            transformer: 'engine.io',
            address : _s.details.address + ':' + _s.details.port,
            redis: _s.oReq.redis.createClient(_s.oConfig.connections.redis.port,_s.oConfig.connections.redis.host)
        };
    _s.primus = new _s.oReq.Primus(_s.oReq.http, primusOptions);


    _s.primus.use('multiplex', _s.oReq.primusMultiplex);
    _s.primus.use('resource', _s.oReq.primusResource);
    _s.primus.use('rooms', _s.oReq.primusRooms);
    _s.primus.use('emitter', _s.oReq.primusEmitter);
    _s.primus.use('metroplex', _s.oReq.primusMetroplex);
    _s.primus.use('cluster', _s.oReq.primusCluster);

    var port = 8001;
    var credential = {"email" : 'ya@ya.com', "password" : 'a'};

    if(_s.details.port == 8001){
        port = 8002;
        credential = {"email" : 'yanivkalfa@yahoo.com', "password" : 'a'};
    }

    var options = {
            "hostname" : 'localhost',
            "port" : port
        }
        , HttpTransit = new _s.oModules.HttpTransit(),
        data = {
            "method" : 'login',
            "status" : 0,
            "success" : false,
            "data" : credential
        }
        ;

    options = HttpTransit.prepareRequest(options, false, data);

    setTimeout(function(){
        HttpTransit.doRequest(options, data).then(function(resp){
            try{
               var response = JSON.parse(resp);
            }catch(e){
                console.log(e);
                return false;
            }


            //resp
            if(response.success){
                var Socket = _s.primus.Socket;
                var client = new Socket('http://localhost:' + (_s.details.port == 8001 ? 8002 : 8001) + '/?token=' + response.data.token);
                client.on('open', function open() {
                    console.log('open');
                });

                client.write({"m": "ping", "d":"p"});
            }

            /*

            */
        });


    }, 15000);


    _s.primus.on('connection', function (spark) {

        console.log('got here');

        _s.oReq.jwt.verify(spark.query.token, sessSecret, function(err, decoded) {
            if(!_.isUndefined(decoded) && !_.isUndefined(decoded.userId)){
                _s.oModules.Authorization.login({"_id" : decoded.userId}).then(function(user){
                    if(user === null)
                    {
                        spark.end({"method" : "disconnect", msg : "Could not authenticate user a."} );
                    }
                    else
                    {
                        // Attaching user to spark - for logout and maybe future needs
                        spark.user = user;

                        // Update user's spark id in database - in-case its needed
                        var updateSpark = function(user){
                            return new _s.oReq.Promise(function(resolve, reject) {
                                user.spark = spark.id;
                                user.save(function (err, user) {
                                    if(err) reject(err);
                                    return resolve(user);
                                });
                            });
                        };


                        var upSkSuccess = function (user){

                            // Joining terminal, lobby user rooms and saved rooms
                            var userRoom = 'u_' + decoded.userId;
                            spark.join('terminal '+ userRoom, function(err, succ){});

                            _.isArray(user.rooms) && _(user.rooms).forEach(function(room){
                                var data  = {
                                    "m" : 'room',
                                    "d" : {
                                        "m" : '_join',
                                        "d" : {
                                            "id" : room,
                                            "type" : 'chat',
                                            "users" : {username : user.username, id : user.id}
                                        }
                                    }
                                };

                                RoutSocket.chat(spark,data);
                            });

                        };

                        var upSkFail = function(err){
                            console.log(err);
                            if(err) updateSpark(user).then(upSkSuccess).catch(upSkFail)
                        };

                        if(user.type !== 'server'){
                            updateSpark(user).then(upSkSuccess).catch(upSkFail);
                        }


                        var RoutSocket = new _s.oModules.RoutSocket(_s.primus);
                        spark.on('data', function (msg) {
                            RoutSocket.rout(spark, msg);
                        });
                    }

                }).catch(function(err){
                    if(err) spark.end({"method" : "disconnect", msg : "Could not authenticate user b."} );
                });
            }else{
                spark.end({"method" : "disconnect", msg : "Could not authenticate user c."} );
            }
        });
    });


    _s.primus.on('end', function () {
        console.log('end');
    });

    _s.primus.on('disconnection', function (spark) {
        console.log('disconnection ' , spark.id);
    });

    _s.primus.on('leaveallrooms', function (rooms, spark) {
        if(!spark) return false;
        try{
            var RoutRoom = new _s.oModules.RoutRoom(_s.primus);
            _s.oModules.User.fetchUser({"id":spark.user.id}).then(function(user){
                _.isArray(user.rooms) && _(user.rooms).forEach(function(room){
                    var aRoom  = {
                        "id" : room,
                        "type" : 'chat',
                        "users" : {}
                    };
                    RoutRoom._leave(spark, aRoom)
                });
            }).catch(console.log);
        }catch(e){console.log(e)}

        return true;
    });
};