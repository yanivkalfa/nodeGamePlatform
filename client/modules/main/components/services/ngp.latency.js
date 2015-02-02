/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Latency', [
        Latency
    ]);

function Latency() {

    function LatencyService(){
        this._pingSent = 0;
        this._pingreturn = 0;
        this._latency = 0;
        this._accomulativeLatency = 0;
        this._rounds = 0;
        this._timeElapsed = 0;

        this.cycleTime = 60*60*1000;
        //this.pingEvery = 30*1000;
        //this.pingInterval = false;
    }

    LatencyService.prototype =  {

        init : function(){
            var self = this;
            self._pingSent = 0;
            self._pingreturn = 0;
            self._accomulativeLatency = 0;
            self._timeElapsed = 0;
            self._latency = 0;
            self._rounds = 0;
            return self;
        },

        outgoingPing : function(unixTimestamp){
            this._pingSent = unixTimestamp;
            if(this.cycleTime <= this._timeElapsed) this.init();
        },
        incomingPong : function(unixTimestamp){
            var self = this;
            this._pingreturn = unixTimestamp;
            self.calculateLatency();

        },
        calculateLatency : function(){
            var tipTime = this._pingreturn - this._pingSent;
            this._rounds++;
            this._timeElapsed += tipTime;
            this._accomulativeLatency += tipTime;
            this._latency = this._accomulativeLatency/this._rounds;
        },
        getLatency : function(){
            return Math.round(this._latency);
        }
        /*
        destroy : function(){
            this.reset();
        },

        pingServer : function(){
            this._pingSent = Date.now();
            WebSocket.Primus.write({"m": "ping", "d":"p"});

            if(this.cycleTime <= this._timeElapsed) this.init();

            this._timeElapsed += this.pingEvery;
        },

        reset : function(){
            this._pingSent = 0;
            this._pingreturn = 0;
            this._accomulativeLatency = 0;
            this._timeElapsed = 0;
            this._latency = 0;
            this._rounds = 0;
            //clearInterval(this.pingInterval);
        },*/


        /*
        bindPing : function(){
            var self = this;
            WebSocket.ping = function(data){
                self.calculateLatency(data);
                $rootScope.ngp.bar.stats.latency = self.getLatency();
                $rootScope.$apply();
            };
        }
        */


    };

    return new LatencyService();
}
