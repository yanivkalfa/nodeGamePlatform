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
            RoutQueue
        ]);

    function RoutQueue(
        $rootScope,
        $modal,
        Router,
        Games,
        Queues,
        QueueUser,
        Notify
        ) {

        function RoutQueueFactory(){
            Router.apply(this, arguments);
        }

        RoutQueueFactory.prototype = Object.create(Router.prototype);
        RoutQueueFactory.prototype.constructor = RoutQueueFactory;

        RoutQueueFactory.prototype.ready = function(q){
            var queue = Queues.get(q.id);
            queue.users.add(q.users);
            queue.setRoom(q.room);

            var modalInstance = $modal.open({
                templateUrl: ngp.const.app.url + '/tpl/directives/queuePopUp.html',
                controller: 'queueReadyController',
                controllerAs : 'qready',
                resolve: {
                    queue: function () {
                        return queue;
                    }
                }
            });
            queue.setWindow(modalInstance);

            modalInstance.result.then(function (close) {
                queue.end(close);
            }, function () {
                console.log('something happened');
            });
        };
        RoutQueueFactory.prototype.join = function(q){
            console.log('q', q);
            var self = this
                , queue = {
                    id : q.id || Queues.createRequestId(),
                    users : new QueueUser(q.users),
                    name:q.name,
                    userCount : q.userCount
                }
                , game
                ;
            console.log('Games', Games);
            game = Games.get(q.name);

            console.log('q.queueName', q.name);

            console.log('game', game);
            game.setQueueImage();
            if(game.isQueued()) {
                Notify.error('You cannot queue to the same game twice');
                return false;
            }
            queue = Queues.add(queue);
            game.setQueue(queue.id);
            return queue
        };

        RoutQueueFactory.prototype.leave = function(q){
            Queues.remove(q.id);
        };

        RoutQueueFactory.prototype.accept = function(q){
            var queue = Queues.getByPropName('_room',q.room);
            queue.users.accept(q.user);
            if(queue.usersReady()){
                queue.getWindow().close('Starting game');
                Notify.success('Starting game');
            }
        };

        RoutQueueFactory.prototype.decline = function(q){
            var queue = Queues.getByPropName('_room',q.room);
            queue.users.decline(q.user);
            Queues.remove(q.id);
            queue.getWindow().close('Decline game');
            Notify.success('Declined game');
        };

        return RoutQueueFactory;
    }
})();