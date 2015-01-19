/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Console', [
        Console
    ]);

function Console() {

    function ConsoleService(){
        this._intervalInit = false;

        this.interval = 1000;
        this.cronFunctions = [];

        this.init();
    }

    ConsoleService.prototype =  {

        init : function(){
            var self = this;

            this._intervalInit = setInterval(_.bind(self.cronCycle, self), self.interval);
        }
    };

    return new ConsoleService();
}