module.exports = function(_s){

    var _ = _s.oReq.lodash;

    function SocketAjax (){
        this.requests = {};
        this.timeout = 4000;
    }

    SocketAjax.prototype.noop = function(){};

    SocketAjax.prototype.dispatch = function(request){
        var self = this
            , id
            ;
        console.log('request.timeOut || self.timeOut', request.timeOut || self.timeOut);
        if(!self.checkRequest(request)) return false;
        id = self.queueRequest(request);
        request.timer = setTimeout(function(){
            self.trigger(false, id, 'request timed out!');
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
        return self.trigger(msg.d.s, msg.id, msg.d.d);
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