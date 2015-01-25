/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Router', [
        Router
    ]);

function Router() {

    function RouterFactory(){ }

    RouterFactory.prototype =  {

        rout: function(msg){
            var self = this;
            self[msg.m](msg.d);
        }

    };

    return RouterFactory;
}