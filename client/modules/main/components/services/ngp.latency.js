/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Latency', [
        '$rootScope',
        'WebSocket',
        Latency
    ]);

function Latency($rootScope,WebSocket) {

    function LatencyService(){
        this._pingSent = 0;
        this._pingreturn = 0;
        this._latency = 0;
        this._accomulativeLatency = 0;
        this._rounds = 0;
        this._timeElapsed = 0;

        this.cycleTime = 60*60*1000;
    }

    LatencyService.prototype =  {

        init : function(){
            var self = this;
            self.reset();
            self.bindSocket();
            return self;
        },

        reset : function(){
            this._pingSent = 0;
            this._pingreturn = 0;
            this._accomulativeLatency = 0;
            this._timeElapsed = 0;
            this._latency = 0;
            this._rounds = 0;
            this.unbindSocket();
        },

        unbindSocket : function(){
            var self = this;
            //WebSocket.Primus.on('outgoing::ping', _.bind(self.outgoingPing,self));
            //WebSocket.Primus.on('incoming::pong', _.bind(self.incomingPong,self));
        },

        bindSocket : function(){
            var self = this;
            WebSocket.Primus.on('outgoing::ping', _.bind(self.outgoingPing,self));
            WebSocket.Primus.on('incoming::pong', _.bind(self.incomingPong,self));
        },

        outgoingPing : function(unixTimestamp){
            this._pingSent = Date.now();
            if(this.cycleTime <= this._timeElapsed) this.init();
        },
        incomingPong : function(unixTimestamp){
            var self = this;
            this._pingreturn = Date.now();
            self.calculateLatency();
            $rootScope.ngp.bar.stats.latency = self.getLatency();
            $rootScope.$apply();
        },
        calculateLatency : function(){
            var tripTime = this._pingreturn - this._pingSent;
            this._rounds++;
            this._timeElapsed += tripTime;
            this._accomulativeLatency += tripTime;
            this._latency = this._accomulativeLatency/this._rounds;
        },
        getLatency : function(){
            return Math.round(this._latency);
        }
    };

    return new LatencyService();
}
