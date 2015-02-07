module.exports = function(_s){

    var _ = _s.oReq.lodash;

    function SocketAjax (){
        this.requests = {};
        this.timeout = 4000;
    }

    SocketAjax.prototype.noop = function(){};

    SocketAjax.prototype.sJax = function(details){
        var self = this;
        return new _s.oReq.Promise(function(resolve, reject) {
            var serverDetails, Socket, client, Servers;
            Servers = require(_s.oConfig.pathsList.Servers)(_s);
            serverDetails = details.server;
            Servers.login(serverDetails).then(function(authorizedUser){

                Socket = _s.primus.Socket;
                client = new Socket('http://'+serverDetails.address + ':' + serverDetails.port + '/?token=' + authorizedUser.token);
                client.on('open', function open() {
                    self.dispatch({
                        to : client,
                        data : details.data,
                        timeOut : details.timeOut || 10000,
                        success : function success(resp){
                            client.end();
                            return resolve(resp);
                        },
                        error : function error(resp){
                            client.end();
                            return reject(resp);
                        }
                    });
                });
                client.on('disconnection', function(reason){
                    return reject('disconnection');
                });

                client.on('data', self.response.bind(self, client));
            }).catch(function(err){
                console.log('no login');
                return reject(err);
            });
        });
    };

    SocketAjax.prototype.dispatch = function(request){
        var self = this
            , id
            ;
        console.log('request.timeOut || self.timeOut', request.timeOut || self.timeOut);
        if(!self.checkRequest(request)) return false;
        id = self.queueRequest(request);
        request.timer = setTimeout(function(){
            self.trigger(false, id, 'request timed out!');
            console.log('timed out');
        }, request.timeOut || self.timeOut);

        console.log('dispatch - request id: ', id);

        request.to.write(self.prepareRequest(id));
    };

    SocketAjax.prototype.checkRequest = function(request){
        var self = this;
        if(!request.to || 'object' !== typeof request.to) return false;
        if(!request.success || 'function' !== typeof request.success) request.success = self.noop;
        if(!request.error || 'function' !== typeof request.error) request.error = self.noop;
        return true;
    };

    SocketAjax.prototype.queueRequest = function(request){
        var self = this
            ,id = self.createRequestId()
            ;
        self.requests[id] = request;
        return id;
    };

    SocketAjax.prototype.createRequestId = function(){
        var genRandomId = function(){
                var start = Math.floor(Math.random()*30000).toString()
                    , dateNow = Date.now().toString()
                    ;
                return start+dateNow
            }
            , self = this
            , id = genRandomId()
            ;

        while(!_.isEmpty(self.requests[id])){
            id = genRandomId();
        }
        return id;
    };

    SocketAjax.prototype.prepareRequest = function(id){
        var self = this
            , request
            ;

        request = {
            "m":"sjax",
            "d" : {
                "m" : "req",
                "d" : {
                    "id" : id,
                    "d" :  self.requests[id].data
                }
            }
        };
        return request;
    };

    SocketAjax.prototype.response = function(spark,msg){
        var self = this;
        return self.trigger(msg.d.s, msg.id, msg.d);
    };

    SocketAjax.prototype.trigger = function(success, id, data){
        var self = this;
        if(success) self.requests[id].success(data);
        else self.requests[id].error(data);

        clearTimeout(self.requests[id].timer);
        delete self.requests[id];
    };




    return new SocketAjax();
};