/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('Game', [
            Game
        ]);

    function Game() {

        function GameFactory(id,name,queueName, userCount, img){
            this._queue = undefined;

            this.id = id || undefined;
            this.name = name || undefined;
            this.queueName = queueName || undefined;
            this.userCount = userCount || 2;
            this.img = img || this.name + '.png' || undefined;
        }

        GameFactory.prototype =  {
            setQueue : function(queue){
                this._queue = queue;
            },

            setQueueImage : function(){
                this.img = 'queueSearching.gif';
            },

            resetQueueImage : function(){
                this.img = this.name + '.png';
            },

            isQueued : function(){
                return !_.isEmpty(this._queue);
            },

            getQueue : function(){
                return this._queue;
            }

        };

        return GameFactory;
    }
})();