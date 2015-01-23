/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Latency', [
        '$rootScope',
        '$q',
        'WebSocket',
        Latency
    ]);

function Latency($rootScope, $q, WebSocket) {

    function LatencyService(){
        this._pingSent = 0;
        this._pingreturn = 0;
        this._latency = 0;
        this._accomulativeLatency = 0;
        this._rounds = 0;
        this._timeElapsed = 0;

        this.cycleTime = 60*60*1000;
        this.pingEvery = 30*1000;
        this.pingInterval = false;
    }

    LatencyService.prototype =  {

        init : function(){
            var self = this;
            this.reset();
            this.bindPing();
            this.pingServer();
            clearInterval(this.pingInterval);
            this.pingInterval = setInterval(_.bind(this.pingServer, this),this.pingEvery);
            return self;
        },

        pingServer : function(){
            this._pingSent = Date.now();
            WebSocket.Primus.write({"m": "ping", "d":"p"});

            if(this.cycleTime <= this._timeElapsed){
                this.init();
            }
            this._timeElapsed += this.pingEvery;
        },

        reset : function(kill){
            this._pingSent = 0;
            this._pingreturn = 0;
            this._accomulativeLatency = 0;
            this._rounds = 1;
            this._timeElapsed = 0;
            if(kill){
                this._latency = 0;
                this._rounds = 0;
                clearInterval(this.pingInterval);
            }
        },
        calculateLatency : function(){
            this._rounds++;
            this._pingreturn = Date.now();
            this._accomulativeLatency += this._pingreturn - this._pingSent;
            this._latency = this._accomulativeLatency/this._rounds;
        },
        getLatency : function(){
            return Math.round(this._latency);
        },

        bindPing : function(){
            var self = this;
            WebSocket.ping = function(data){
                self.calculateLatency(data);
                $rootScope.ngp.bar.stats.latency = self.getLatency();
                $rootScope.$apply();
            };
        }


    };

    return new LatencyService();
}
