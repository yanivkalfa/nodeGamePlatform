
module.exports = function(_s){
    var _ = _s.oReq.lodash
        , pathsList = _s.oConfig.pathsList
        , Authorization = require(pathsList.Authorization)(_s)
        , RoutSocket = require(pathsList.RoutSocket)(_s)
        , RoutRoom = require(pathsList.RoutRoom)(_s)
        , User = require(pathsList.User)(_s)
        , Queues = require(pathsList.Queues)
        , QueuesApi = require(pathsList.QueuesApi)(_s)
        , sessCon = _s.oConfig.session.connection
        , sessSecret = _s.oConfig.session.secret
        , primusOptions = {
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

    _s.primus.on('connection', function (spark) {

        console.log('trying');
        _s.oReq.jwt.verify(spark.query.token, sessSecret, function(err, decoded) {
            if(!_.isUndefined(decoded) && !_.isUndefined(decoded.userId)){
                Authorization.login({"_id" : decoded.userId}).then(function(user){
                    if(user === null)
                    {
                        spark.end({"method" : "disconnect", msg : "Could not authenticate user a."} );
                    }
                    else
                    {
                        console.log('connected:',user.username);
                        // Attaching user to spark - for logout and maybe future needs
                        spark.user = user;
                        //spark.Queues = new Queues();

                        console.log('user',user);

                        var routSocket = new RoutSocket();

                        // Update user's spark id in database - in-case its needed
                        var updateSpark = function(user){
                            return new _s.oReq.Promise(function(resolve, reject) {
                                user.server = {"address": _s.details.address, "port" : _s.details.port};
                                user.spark = spark.id;
                                user.save(function (err, user) {
                                    if(err) reject(err);
                                    return resolve(user);
                                });
                            });
                        };


                        var upSkSuccess = function (user){

                            console.log('upSkSuccess got here');

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
                                console.log('join room: ', room);
                                routSocket.chat(spark,data);
                            });

                            QueuesApi.fetch({user:user.id}).then(function(queues){
                                _.isArray(queues) && _(queues).forEach(function(queue){

                                    var data  = {
                                        "m" : '_join',
                                        "d" : {
                                            id : queue.id,
                                            user : {id:queue.user.id,username : queue.user.username},
                                            name:queue.name,
                                            userCount : queue.game.userCount
                                        }
                                    };
                                    routSocket.queue(spark,data);
                                });
                            });

                        };

                        var upSkFail = function(err){
                            console.log(err);
                            if(err) updateSpark(user).then(upSkSuccess).catch(upSkFail)
                        };

                        if(user.uType == 'user'){
                            updateSpark(user).then(upSkSuccess).catch(upSkFail);
                        }

                        spark.on('data', function (msg) {
                            console.log('webSocket', msg);
                            routSocket.rout(spark, msg);
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
        try{
            console.log('disconnection ' , spark.user.username);
        }catch(e){
            console.log(e);
        }

    });

    _s.primus.on('leaveallrooms', function (rooms, spark) {
        if(!spark) return false;
        try{
            if(spark.user.uType != 'user') return;
            var routRoom = new RoutRoom(_s.primus);
            User.fetchUser({"id":spark.user.id}).then(function(user){
                _.isArray(user.rooms) && _(user.rooms).forEach(function(room){
                    var aRoom  = {
                        "id" : room,
                        "type" : 'chat',
                        "users" : {}
                    };
                    routRoom._leave(spark, aRoom)
                });
            }).catch(console.log);
        }catch(e){console.log(e)}

        return true;
    });
};