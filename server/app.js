var _s = {};
_s.oServerN = process.argv[3]; // severName - not required
_s.port = process.argv[2] || 8001; // server port - required
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.oConfig = require('./settings/config'); // require config files.
global.oCore = require('./core')(_s); // require core files.
_s.oModules = require('./lib/modules')(_s); // require utility functions

var _ = _s.oReq.lodash,
    sessCon = _s.oConfig.session.connection,
    sessSecret = _s.oConfig.session.secret,
    sessMaxAge = _s.oConfig.session.maxAge,
    primusOptions = {
        cluster: {
            redis: {
                port: _s.oConfig.connections[sessCon].port,
                host: _s.oConfig.connections[sessCon].host,
                connect_timeout: 200
            }
        },
        transformer: 'engine.io'
    };
_s.primus = new _s.oReq.Primus(_s.oReq.http, primusOptions);

_s.primus.use('multiplex', _s.oReq.primusMultiplex);
_s.primus.use('resource', _s.oReq.primusResource);
_s.primus.use('rooms', _s.oReq.primusRooms);
_s.primus.use('emitter', _s.oReq.primusEmitter);
_s.primus.use('cluster', _s.oReq.primusCluster);

_s.oReq.app.use(_s.oReq.session({
    store: new _s.oReq.RedisStore({
        port : _s.oConfig.connections[sessCon].port,
        host : _s.oConfig.connections[sessCon].host
    }),
    secret: sessSecret,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: sessMaxAge }
}));

_s.oRouts = require('./lib/requiredRouts.js')(_s);
var ab = {
    ping : function(spark, data){
        spark.write({"m": "ping", "d":"p"});
    }
};

//

_s.primus.rooms(function(err, rooms){
    console.log("primus rooms", rooms);

    rooms.forEach(function(room){
        _s.primus.room(room).empty();
    });
});
_s.primus.on('connection', function (spark) {

    _s.oReq.jwt.verify(spark.query.token, sessSecret, function(err, decoded) {
        if(!_.isUndefined(decoded) && !_.isUndefined(decoded.userId)){
            _s.oModules.User.login({"_id" : decoded.userId}).then(function(user){
                if(user === null)
                {
                    spark.end({"method" : "disconnect", msg : "Could not authenticate user."} );
                }
                else
                {
                    spark.userId = decoded.userId;

                    var webSocket = _s.oModules.WebSocket();
                    var WebSocketExtender = function(){
                        webSocket.call(this,_s, _s.primus, spark);
                    };
                    var extendRouterWith = {
                        ping : function(spark, data){
                            spark.write({"m": "ping", "d":"p"});
                        },
                        initChat : function(spark, data){
                            console.log('initing');
                            var channels = [
                                {
                                    id : '',
                                    title:'Dynamic Title 1',
                                    content:{
                                        msg : [
                                            {id:"01",from:"SomeOne", data: 1421700566413, formatDate :  '', content : "This is a message", toType: "private"},
                                            {id:"02",from:"SomeOne", data: 1421700569382, formatDate :  '', content : "message 2" , toType: "room"},
                                            {id:"03",from:"SomeOne", data: 1421700502938, formatDate :  '', content : "message 3" , toType: "room"}
                                        ],
                                        members:['SomeOne', 'someone2', 'someone3']
                                    }
                                },
                                {
                                    id : '',
                                    title:'Dynamic Title 2',
                                    content:{
                                        msg : [
                                            {id:"01",from:"SomeOne", data: 1421700566413, formatDate : '', content : "This is a message", toType: "room"},
                                            {id:"02",from:"SomeOne", data: 1421700569382, formatDate : '', content : "message 2" , toType: "room"},
                                            {id:"03",from:"SomeOne", data: 1421700502938, formatDate : '', content : "message 3" , toType: "room"}
                                        ],
                                        members:['SomeOne', 'someone2', 'someone3']
                                    }
                                }
                            ];

                            var data = {
                                m : 'initChat',
                                d : channels
                            };

                            spark.write({"m": "chat", "d":data});
                        },
                        msg : function(msg){
                            c.oVars.oMsgRouter.routMsg(msg);
                        },
                        roomDo : function(msg){
                            c.oVars.oRoomRouter.routRoom(msg);
                        }
                    };
                    WebSocketExtender.prototype = webSocket.prototype;
                    _s.oModules.uf.extend(WebSocketExtender, extendRouterWith);

                    var webSocketExtender = new WebSocketExtender();
                    webSocketExtender.initChat(spark);

                    /*

                    var router = new s.utilFunc.CallRouter(socket);
                    var msgRouter = new s.utilFunc.MsgRouter(c.oVars.oRoomHandler);
                    var roomRouter = new s.utilFunc.roomRouter(c.oVars.oRoomHandler);


                    var RouterExtender = function(){};
                    var extendRouterWith = {
                        ping : function(msg){
                            spark.write({"m": "ping", "d":"p"});
                        },
                        msg : function(msg){
                            c.oVars.oMsgRouter.routMsg(msg);
                        },
                        roomDo : function(msg){
                            c.oVars.oRoomRouter.routRoom(msg);
                        }
                    };
                    RouterExtender.prototype = c.oVars.oRouter;
                    s.utilFunc.extend(RouterExtender, extendRouterWith);
                    new RouterExtender();*/
                }

            }).catch(function(err){
                if(err) spark.end({"method" : "disconnect", msg : "Could not authenticate user."} );
            });
        }else{
            spark.end({"method" : "disconnect", msg : "Could not authenticate user."} );
        }
    });



    spark.join("aRoomName", function () {

        // send message to this client
        //spark.write('you joined room ' + "aRoomName");

        // send message to all clients except this one
        //spark.room("aRoomName").except(spark.id).write(spark.id + ' joined room ' + "aRoomName");


        /*
        primus.rooms(function(err, rooms){
            console.log("primus rooms", rooms);

            rooms.forEach(function(room){
                primus.room(room).clients(function(err, cs){
                    console.log(err, cs);
                });
            });
        });

        */



        /*

        primus.rooms(spark.id,function(err, rooms){
            console.log("primus room", rooms);
        });

        spark.rooms(function(err, rooms){
            console.log("spark room", rooms);
        });
        */
    });

    //console.log(primus);

    /*
    spark.join("aRoomName", function () {

        // send message to this client
        //spark.write('you joined room ' + "aRoomName");

        // send message to all clients except this one
        spark.room("aRoomName").except(spark.id).write(spark.id + ' joined room ' + "aRoomName");

        primus.rooms(function(err, rooms){
            console.log("primus room", rooms);
        });

        primus.rooms(spark.id,function(err, rooms){
            console.log("primus room", rooms);
        });

        spark.rooms(function(err, rooms){
            console.log("spark room", rooms);
        });
    });
    */

    /*
    spark.on('data', function (msg) {
        try{ab[msg.m](spark, msg.d);}catch(e){}
    });
    */
});


_s.primus.on('end', function () {
    console.log('end');
});

_s.primus.on('disconnection', function (spark) {
    //console.log(spark);
});

_s.primus.on('leaveallrooms', function (rooms, spark) {
    console.log('leaving all rooms');
    // works when the client closes the connection
});


/*
setTimeout(function(){
    User.find().exec(function (err, users) {
        users.forEach(function(user){
            user.remove();
        });

        console.log('users', users);
    });
}, 5000);
*/



/*
 var schema = new _s.oReq.mongoose.Schema({ name: 'string', size: 'string' });
 var Tank = oCore._connection.model('Tank', schema);

 Tank.create({ size: 'small' }).then( function (res) {
 console.log('res', res);
 },  function (err) {
 if(err)console.log('err', err);
 });

 Tank.find().exec(function(err, res){
 console.log('find');
 console.log(err, res);
 });
 */


// redis
/*
 var client = _s.oReq.redis.createClient(_s.oConfig.connections.redis.port,_s.oConfig.connections.redis.host);


 client.set("foo_rand000000000000", "OK");

 // This will return a JavaScript String
 client.get("foo_rand000000000000", function (err, reply) {
 console.log(err, reply); // Will print `OK`
 });
 */






//oGlobal : require('./lib/serverGlobal.js'),
//oConfig : require('./lib/serverConfig.js'),
//utilFunc : require('./lib/utilFunc.js'),


_s.oReq.http.listen(_s.port || 8000, function(){
    console.log('listening on *:' + _s.port);
});

















/*
var s = {
    oReq : require('./lib/requiredFiles.js'),
    oGlobal : require('./lib/serverGlobal.js'),
    oConfig : require('./lib/serverConfig.js'),
    utilFunc : require('./lib/utilFunc.js'),
    oFns : {
        init : function(){
            s.utilFunc.s = s;

            s.oReq.app = s.oReq.express();
            s.oReq.http = s.oReq.http.Server(s.oReq.app);
            s.oReq.io = s.oReq.io(s.oReq.http);

            s.oReq.app.use(s.oReq.bodyParser.json());
            s.oReq.app.use(s.oReq.express.static(__dirname + '/css'));
            s.oReq.app.use(s.oReq.express.static(__dirname + '/js'));


            s.oReq.app.set('views', __dirname + '/tpl');
            s.oReq.app.set('view engine', "jade");
            s.oReq.app.engine('jade', s.oReq.jade.__express);
            s.oReq.app.get("/", function(req, res){
                res.locals.options = {
                    "chGlobal" : {
                        "rooms" : [s.oGlobal.rooms[0]],
                        "totalGames" : s.oGlobal.totalGames,
                        "totalMembers" : s.oGlobal.totalMembers,
                        "gameList" : s.oGlobal.gameList
                    },
                    "ajaxURL" : "/ajaxHandler",
                    "data" : {}
                };
                res.render('main');
            });

            s.oReq.app.get('/assets/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/assets/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/assets/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.get('/css/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/css/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/css/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.get('/css/images/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/css/images/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/css/images/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.get('/images/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/images/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/images/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.get('/js/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/js/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/js/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.get('/js/lib/:name', function (req, res) {
                s.oReq.fs.exists(__dirname + '/js/lib/' + req.params.name, function(exists) {
                    if (exists) {
                        res.sendfile(__dirname + '/js/lib/' + req.params.name);
                    }
                    else
                    {
                        res.status(404).send('404 page !!!!');
                    }
                });
            });

            s.oReq.app.post('/ajaxHandler', function (req, res) {
                var ajaxHandler = require('./lib/ajaxHandler.js'),
                    ajaxHandlerInit = new ajaxHandler(req.body, s.oGlobal, s.oConfig),
                    profile, result = ajaxHandlerInit.result,
                    resp = {
                        "success" : false
                    };

                if(result.success)
                {
                    profile = {
                        "id" : s.oGlobal.LastId,
                        "nickName" : result.msg
                    };
                    resp.success = true;
                    resp.msg = {
                        "token" : s.oReq.jwt.sign(profile, s.oReq.jwt_secret, { expiresInMinutes: 60 * s.oConfig.cookieExpiration }),
                        "id" : s.oGlobal.LastId,
                        "nickName" : result.msg
                    };
                    s.oGlobal.LastId++;
                }
                else
                {
                    resp.msg =  result.msg
                }
                res.json(resp);
            });

            s.oReq.io.use(s.oReq.socketio_jwt.authorize({
                secret: s.oReq.jwt_secret,
                handshake: true
            }));

            s.oReq.io.on('connection', function(socket){
                var c = {
                    oVars:{
                        oRouter : {},
                        oMsgRouter : {},
                        oRoomRouter : [],
                        oRoomHandler : new s.oReq.roomHandler(s.oGlobal.rooms,s.oReq.io, s.oGlobal.members, socket)

                    },
                    oFns:{

                        init : function(){
                            //s.oReq.roomHandler._socket = socket;

                            var nickName = socket.decoded_token.nickName,
                                index,
                                id = socket.decoded_token.id,
                                nickNameIndex = s.oGlobal.badNickNames.length,
                                memberIndex = s.oGlobal.members.length;
                            s.oGlobal.badNickNames.push(nickName);
                            s.oGlobal.members[nickName] = socket;
                            c.oVars.oRoomHandler.join({
                                "name" : "lobby",
                                "type" : "chat",
                                "nickName" : nickName
                            });

                            c.oVars.oRouter = new s.utilFunc.CallRouter(socket);
                            c.oVars.oMsgRouter = new s.utilFunc.MsgRouter(c.oVars.oRoomHandler);
                            c.oVars.oRoomRouter = new s.utilFunc.roomRouter(c.oVars.oRoomHandler);


                            var RouterExtender = function(){};
                            var extendRouterWith = {
                                ping : function(msg){
                                    this.oSocket.emit('response', {"method": "ping", "msg":msg});
                                },
                                msg : function(msg){
                                    c.oVars.oMsgRouter.routMsg(msg);
                                },
                                roomDo : function(msg){
                                    c.oVars.oRoomRouter.routRoom(msg);
                                }
                            };
                            RouterExtender.prototype = c.oVars.oRouter;
                            s.utilFunc.extend(RouterExtender, extendRouterWith);
                            new RouterExtender();


                            socket.on('disconnect', function(){
                                s.oGlobal.badNickNames.splice(nickNameIndex,1);
                                delete s.oGlobal.members[nickName];
                                c.oVars.oRoomHandler.leaveAll(nickName);
                            });
                        }
                    }
                };

                c.oFns.init();
            });


            s.oReq.http.listen(8000, function(){
                console.log('listening on *:8000');
            });
        }
    }
};
s.oFns.init();
/*
var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express(),
    http = require('http').Server(app),
    jade = require('jade'),
    io = require('socket.io')(http),
    socketio_jwt = require('socketio-jwt'),
    jwt = require('jsonwebtoken'),
    jwt_secret = 'Sh3 7S3#2 &1hjS82 3hjS91',

    cgGlobal = {
        "LastId" : 0,
        "badNickNames" : [],
        "members": {},
        "rooms" : {},
        "totalGames" : 0,
        "totalMembers" : 0,
        "gameList" : [
            {"name" : "pong", "instantiations" : []}
        ]
    },
    serverConfig = {
        "cookieExpiration" : 30,
        "maxNickNameLength" : 15
    },
    serverVars = {
        "LastId" : 0,
        "badNickNames" : []
    },

    roomHandler = require('./lib/roomHandler.js').roomHandler;

roomHandler.rooms = cgGlobal.rooms;
roomHandler._io = io;
roomHandler._members = cgGlobal.members;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));


app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', jade.__express);
app.get("/", function(req, res){
    res.locals.options = {
        "chGlobal" : cgGlobal,
        "ajaxURL" : "/ajaxHandler",
        "data" : {}
    };

    res.render('main');
});

app.get('/css/:name', function (req, res) {
    fs.exists(__dirname + '/css/' + req.params.name, function(exists) {
        if (exists) {
            res.sendfile(__dirname + '/css/' + req.params.name);
        }
        else
        {
            res.status(404).send('404 page !!!!');
        }
    });
});

app.get('/css/images/:name', function (req, res) {
    fs.exists(__dirname + '/css/images/' + req.params.name, function(exists) {
        if (exists) {
            res.sendfile(__dirname + '/css/images/' + req.params.name);
        }
        else
        {
            res.status(404).send('404 page !!!!');
        }
    });
});

app.get('/images/:name', function (req, res) {
    fs.exists(__dirname + '/images/' + req.params.name, function(exists) {
        if (exists) {
            res.sendfile(__dirname + '/images/' + req.params.name);
        }
        else
        {
            res.status(404).send('404 page !!!!');
        }
    });
});

app.get('/js/:name', function (req, res) {
    fs.exists(__dirname + '/js/' + req.params.name, function(exists) {
        if (exists) {
            res.sendfile(__dirname + '/js/' + req.params.name);
        }
        else
        {
            res.status(404).send('404 page !!!!');
        }
    });
});

app.get('/js/lib/:name', function (req, res) {
    fs.exists(__dirname + '/js/lib/' + req.params.name, function(exists) {
        if (exists) {
            res.sendfile(__dirname + '/js/lib/' + req.params.name);
        }
        else
        {
            res.status(404).send('404 page !!!!');
        }
    });
});

app.post('/ajaxHandler', function (req, res) {
    var ajaxHandler = require('./lib/ajaxHandler.js'),
        ajaxHandlerInit = new ajaxHandler(req.body, cgGlobal, serverConfig),
        profile, result = ajaxHandlerInit.result,
        resp = {
            "success" : false
        };

    if(result.success)
    {
        profile = {
            "id" : cgGlobal.LastId,
            "nickName" : result.msg
        };
        resp.success = true;
        resp.msg = {
            "token" : jwt.sign(profile, jwt_secret, { expiresInMinutes: 60 * serverConfig.cookieExpiration }),
            "id" : cgGlobal.LastId,
            "nickName" : result.msg
        };
        cgGlobal.LastId++;
    }
    else
    {
        resp.msg =  result.msg
    }
    res.json(resp);
});

io.use(socketio_jwt.authorize({
    secret: jwt_secret,
    handshake: true
}));

io.on('connection', function(socket){
    roomHandler._socket = socket;

    //socket.join('aRoom');
    //console.log(io.sockets.adapter.rooms);

    var nickName = socket.decoded_token.nickName,
        index,
        id = socket.decoded_token.id,
        nickNameIndex = cgGlobal.badNickNames.length,
        memberIndex = cgGlobal.members.length;

    cgGlobal.badNickNames.push(nickName);
    cgGlobal.members[nickName] = socket;

    var s = {
        oVars:{

        },
        oFns:{
            bindSockets : function(){
                // mini router
                socket.on('request', function(req){
                    s.oFns[req.method](s, req.msg);
                });

                socket.on('disconnect', function(){
                    cgGlobal.badNickNames.splice(nickNameIndex,1);
                    delete cgGlobal.members[nickName];
                    roomHandler.leaveAll(nickName);
                });
            },
            ping : function(msg){
                //console.log("sending reply");
                socket.emit('response', {"method": "ping", "msg":msg});
            }

        }
    };

    s.oFns.bindSockets();
});


http.listen(8000, function(){
    console.log('listening on *:8000');
});

/*
 GET http://mygametests.info/css/style.css [HTTP/1.1 404 Not Found 34ms]
 GET http://mygametests.info/js/utilFunctions.js [HTTP/1.1 404 Not Found 74ms]
 GET http://mygametests.info/css/style.css
 */