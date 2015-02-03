/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutQueue', [
        '$rootScope',
        '$modal',
        'Router',
        'Queues',
        'Notify',
        RoutQueue
    ]);

function RoutQueue(
    $rootScope,
    $modal,
    Router,
    Queues,
    Notify
    ) {

    function RoutQueueFactory(){
        Router.apply(this, arguments);
    }

    RoutQueueFactory.prototype = Object.create(Router.prototype);
    RoutQueueFactory.prototype.constructor = RoutQueueFactory;

    RoutQueueFactory.prototype.ready = function(queue){
        var queue = Queues.get(queue.id);
        queue.setRoom(queue.room);

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
            queue.endQueue(close);
        }, function () {
            console.log('something happened');
        });
    };

    RoutQueueFactory.prototype.leave = function(queue){
        Queues.remove(queue.id);
    };

    RoutQueueFactory.prototype.accept = function(queue){
        var queue = Queues.getByRoomName(queue.room);
        queue.accept(queue.user);
        if(queue.usersReady()){
            queue.getWindow().close('Starting game');
            Notify.success('Starting game');
        }
    };

    RoutQueueFactory.prototype.decline = function(queue){
        var queue = Queues.getByRoomName(queue.room);
        queue.decline(queue.user);
        Queues.remove(queue.id);
        queue.getWindow().close('Decline game');
        Notify.success('Declined game');
    };

    return RoutQueueFactory;
}