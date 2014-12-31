module.exports = function(_s){
    var defCon = _s.oConfig.connections.defaultConnection, connection = false, con = _s.oConfig.connections[defCon],
        retries = typeof _s.oConfig.connections.retries !== 'undefined' ? _s.oConfig.connections.retries : 5;

    switch(con.adapter){
        case'mongoose':
            var url = 'mongodb://' + con.user + ':' + con.password + '@' + con.host + ':' + con.port + '/' + con.database;
            var connect = function(count){
                if(typeof count === 'undefined' || count < 0){
                    count = 0;
                }
                connection = _s.oReq.mongoose.createConnection(url,function(err, succ){
                    if(err && count < retries){
                        count++;
                        console.log(err);
                        console.log('reconnecting...');
                        connect(count);
                    }
                });
            };

            connect();
            break;
        case'otherAdapter':

            break;

    }

    return connection;
};