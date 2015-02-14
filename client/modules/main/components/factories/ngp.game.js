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
            this._isBusy = false;

            this.id = id || undefined;
            this.name = name || undefined;
            this.queueName = queueName || undefined;
            this.userCount = userCount || 2;
            this.img = img || this.name + '.png' || undefined;

            this.gameDetails = undefined;
        }

        GameFactory.prototype =  {
            setQueue : function(queue){
                this._queue = queue;
            },

            setBusy : function(state){
                this._isBusy = state;
            },

            setQueueImage : function(){
                this.img = 'queueSearching.gif';
            },

            setGameDetails : function(gameDetails){
                console.log('aaaaaaaaaa');
                this.gameDetails = gameDetails;
            },

            resetQueueImage : function(){
                this.img = this.name + '.png';
            },

            getQueue : function(){
                return this._queue;
            },

            getId : function(){
                return this.id;
            },

            getGameDetails : function(){
                return this.gameDetails;
            },

            isBusy : function(){
                return this._isBusy;
            },

            isQueued : function(){
                return !_.isEmpty(this._queue);
            }

        };

        return GameFactory;
    }
})();