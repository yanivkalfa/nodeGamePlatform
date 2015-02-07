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
            var queue = Queues.get(q.id)
                , authorizedUser = Authorization.getUser()
                ;

            _.isArray(q.users) && _(q.users).forEach(function(user){
                user = new QueueUser(user);
                user.setIsMe(authorizedUser.id == q.user.id);
                queue.users.add(user);
            });
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
                game.setBusy(false);
                Notify.error('You cannot queue to the same game twice');
                return false;
            }
            //var authorizedUser = Authorization.getUser();
            //q.user.accepted = false;
            //user = new QueueUser(q.user);
            //user.setIsMe(authorizedUser.id == q.user.id);
            delete q.user;
            queue = Queues.add(q);
            //queue.users.add(user);
            console.log('newly added queue', queue);
            game.setQueue(queue.id);
            console.log('Queue Id', queue.id);
            game.setQueueImage();
            $rootScope.$apply();
            game.setBusy(false);
            console.log('Game after changes', game);
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