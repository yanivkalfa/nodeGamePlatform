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
            var self = this , game, user, queue;
            game = Games.get(q.name);
            if(game.isQueued()) {
                Notify.error('You cannot queue to the same game twice');
                return false;
            }
            var authorizedUser = Authorization.getUser();
            q.user.accepted = false;
            user = new QueueUser(q.user);
            user.setIsMe(authorizedUser.id == q.user.id);
            delete q.user;
            queue = Queues.add(q);
            console.log(user);
            queue.users.add(user);
            game.setQueue(queue.id);
            game.setQueueImage();
            Notify.success('Queued for: ', q.name);
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