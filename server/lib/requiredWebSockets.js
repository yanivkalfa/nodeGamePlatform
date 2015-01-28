
module.exports = function(_s){
    console.log(_s.details.address + ':' + _s.details.port);
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

    /*
    var options = {
            "hostname" : 'localhost',
            "port" : _s.details.cPort
        }
        , HttpTransit = new _s.oModules.HttpTransit(),
        data = {
            "method" : 'login',
            "status" : 0,
            "success" : false,
            "data" : {"email" : _s.details.user.email, "password" : _s.details.user.password}
        }
        ;

    options = HttpTransit.prepareRequest(options, false, data);

    setTimeout(function(){
        console.log('setTimeOut',data);
        HttpTransit.doRequest(options, data).then(function(resp){
            try{
               var response = JSON.parse(resp);
            }catch(e){
                console.log(e);
                return false;
            }

            console.log('response', response);
            if(response.success){
                var Socket = _s.primus.Socket;
                var client = new Socket('http://localhost:' + _s.details.cPort + '/?token=' + response.data.token);
                client.on('open', function open() {
                    console.log('open');
                });

                client.write({"m": "ping", "d":"p"});
            }
        });


    }, 15000);
    */


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
                        var RoutSocket = new _s.oModules.RoutSocket(_s.primus);

                        // Update user's spark id in database - in-case its needed
                        var updateSparkAndServer = function(user){
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
                            if(err) updateSparkAndServer(user).then(upSkSuccess).catch(upSkFail)
                        };

                        if(user.type == 'user'){
                            updateSparkAndServer(user).then(upSkSuccess).catch(upSkFail);
                        }

                        spark.on('data', function (msg) {
                            RoutSocket.rout(spark, msg);
                        });

                        _s.primus.metroplex.servers(function (err, servers) {
                            console.log('registered servers:', servers);
                        });
                    }

                }).catch(function(err){
                    console.log(err);
                    if(err) spark.end({"method" : "disconnect", msg : "Could not authenticate user b."} );
                });
            }else{
                console.log(err);
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