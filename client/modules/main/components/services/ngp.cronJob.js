/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('CronJobs', [
        CronJobs
    ]);

function CronJobs() {

    function CronJobsService(){
        this._intervalInit = false;

        this.interval = 1000;
        this.cronFunctions = [];

        this.init();
    }

    CronJobsService.prototype =  {

        init : function(){
            var self = this;

            this._intervalInit = setInterval(_.bind(self.cronCycle, self), self.interval);
        },

        cronCycle : function(){
            var self = this, now;
            this.cronFunctions.forEach(function(cfn){
                now = Date.now();
                if(cfn.lastExec + cfn.execEvery <= now)
                {
                    cfn.lastExec = now;
                    if(cfn.ref)
                    {
                        cfn.ref[cfn.fn](cfn.args);
                    }
                    else
                    {
                        cfn.f(cfn.args);
                    }
                }
            })
        },

        findCfn : function(fn){
            for(var i = 0; i < this.cronFunctions.length; i++){
                if(this.cronFunctions[i].fn == fn) return i;
            }

            return -1
        },

        add : function(cfn){
            if(this.findCfn(cfn.fn) > -1) return false;

            this.cronFunctions.push(cfn);
            return true;
        },

        update : function(cfn){
            var index = this.findCfn(cfn.fn);
            if(index < 0 ) return false;

            this.cronFunctions[index] = cfn;
            return true;
        },

        remove : function(fn){
            var index = this.findCfn(fn);
            if( index < 0 ) return false;

            this.cronFunctions.splice(index, 1);
            return true;
        }
    };

    return new CronJobsService();
}