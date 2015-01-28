
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
            address : _s.details.address + ':' + _s.details.port
        };
    _s.primus = new _s.oReq.Primus(_s.oReq.http, primusOptions);


    _s.primus.use('multiplex', _s.oReq.primusMultiplex);
    _s.primus.use('resource', _s.oReq.primusResource);
    _s.primus.use('rooms', _s.oReq.primusRooms);
    _s.primus.use('emitter', _s.oReq.primusEmitter);
    _s.primus.use('metroplex', _s.oReq.primusMetroplex);
    _s.primus.use('cluster', _s.oReq.primusCluster);



    _s.primus.on('connection', function (spark) {

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
                            var RoutSocket = new _s.oModules.RoutSocket(_s.primus);
                            spark.on('data', function (msg) {
                                RoutSocket.rout(spark, msg);
                            });

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
                            if(err) _s.oModules.User.fetchUser({"id":decoded.userId}).then(updateSpark).then(upSkSuccess).catch(upSkFail);
                        };

                        _s.oModules.User.fetchUser({"id":decoded.userId}).then(updateSpark).then(upSkSuccess).catch(upSkFail);
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