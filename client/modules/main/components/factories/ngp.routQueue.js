/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('RoutQueue', [
            '$rootScope',
            '$state',
            '$modal',
            'Router',
            'Games',
            'Queues',
            'QueueUser',
            'Notify',
            'Authorization',
            RoutQueue
        ]);

    function RoutQueue(
        $rootScope,
        $state,
        $modal,
        Router,
        Games,
        Queues,
        QueueUser,
        Notify,
        Authorization
        ) {

        function RoutQueueFactory(){
            Router.apply(this, arguments);
        }

        RoutQueueFactory.prototype = Object.create(Router.prototype);
        RoutQueueFactory.prototype.constructor = RoutQueueFactory;



        RoutQueueFactory.prototype.joinFail = function(q){
            if(q.warrning) return Notify.error(q.warrning);
        };
        RoutQueueFactory.prototype.ready = function(q){
            var self = this
                , queue = Queues.getByPropName('game', q.game)
                , authorizedUser = Authorization.getUser()
                , window
                ;

            queue.reset();

            _.isArray(q.users) && _(q.users).forEach(function(user){
                user = new QueueUser(user);
                user.setIsMe(authorizedUser.id == user.id);
                queue.users.add(user);
            });
            queue.setRoom(q.room);
            $rootScope.$apply();

            window = $modal.open({
                templateUrl: ngp.const.app.url + '/tpl/directives/queuePopUp.html',
                controller: 'queueReadyController',
                controllerAs : 'qready',
                backdrop : 'static',
                resolve: {
                    queue: function () {
                        return queue;
                    }
                }
            });
            queue.setWindow(window);

            window.result.then(function (something) {

            }, function (something) {

            });
        };

        RoutQueueFactory.prototype.gameReady = function(g, WebSocket){
            WebSocket.end();
            var game = Games.get(g.name);
            console.log(game);

            throw new Error('aasdasd');
            game.setGameDetails(g);
            $state.go('game', {"game":g.name});
        };

        RoutQueueFactory.prototype.queueEnd = function(q, WebSocket){
            var queue = Queues.getByPropName('_room', q.room);
            this.leave(queue);

            var data  = {
                "m" : 'leaveGameRoom',
                "d" : q.room
            };

            WebSocket.Primus.write({"m":"queue", "d": data});
        };

        RoutQueueFactory.prototype.join = function(q){
            var self = this , game, queue;
            game = Games.get(q.name);
            if(game.isQueued()) {
                game.setBusy(false);
                return false;
            }
            queue = Queues.add(q);
            game.setQueue(queue.id);
            game.setQueueImage();
            $rootScope.$apply();
            game.setBusy(false);
            Notify.success('You\'ve queued for: ', q.name);
        };

        RoutQueueFactory.prototype.leave = function(q){
            var game;
            game = Games.get(q.name);
            if(!game.isQueued()) return false;
            Queues.remove(q.id);
            game.setQueue(undefined);
            game.resetQueueImage();
            $rootScope.$apply();
            game.setBusy(false);
            Notify.success('You\'ve left queue: ', q.name);
        };

        RoutQueueFactory.prototype.accept = function(q){
            var queue = Queues.getByPropName('_room', q.room);
            queue.users.accept(q.user);
            $rootScope.$apply();

            if(queue.usersReady()){
                queue.reset();
            }
        };

        RoutQueueFactory.prototype.decline = function(q){
            var queue = Queues.getByPropName('_room', q.room);
            if(queue.users.length > 0){
                queue.users.decline(q.user);
            }

            queue.startTimer(3, _.bind(queue.reset, queue));
        };

        return RoutQueueFactory;
    }
})();