/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('RoutQueue', [
            '$rootScope',
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

            window = queue.getWindow();
            queue.clearTimers( function(){ $rootScope.$apply(); });
            queue.users.clear();
            if(window) return false;

            _.isArray(q.users) && _(q.users).forEach(function(user){
                user = new QueueUser(user);
                user.setIsMe(authorizedUser.id == user.id);
                queue.users.add(user);
            });
            queue.setRoom(q.room);

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
                queue.getWindow().close('Starting game');
                Notify.success('Starting game');
            }
        };

        RoutQueueFactory.prototype.decline = function(q){
            var window, apply, close;
            var queue = Queues.getByPropName('_room', q.room);
            queue.users.decline(q.user);
            $rootScope.$apply();
            window = queue.getWindow();
            if(window){
                apply = function(){ $rootScope.$apply(); };
                close = function(){
                    window.close();
                    queue.setWindow(undefined);
                    queue.users.clear();
                };
                queue.startTimer(3,apply, close);
            }
        };

        return RoutQueueFactory;
    }
})();