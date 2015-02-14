/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('Router', [
            Router
        ]);

    function Router() {

        function RouterFactory(){ }

        RouterFactory.prototype =  {

            rout: function(msg, a1, a2, a3, a4, a5){
                var self = this;
                console.log(msg);
                self[msg.m](msg.d, a1, a2, a3, a4, a5);
            }

        };

        return RouterFactory;
    }
})();