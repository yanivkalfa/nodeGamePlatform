/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutQueue', [
        '$rootScope',
        '$modal',
        'Router',
        'Queues',
        RoutQueue
    ]);

function RoutQueue(
    $rootScope,
    $modal,
    Router,
    Queues
    ) {

    function RoutQueueFactory(){
        Router.apply(this, arguments);
    }

    RoutQueueFactory.prototype = Object.create(Router.prototype);
    RoutQueueFactory.prototype.constructor = RoutQueueFactory;

    RoutQueueFactory.prototype.ready = function(msg){
        console.log('ready',msg);
        var queue = Queues.get(msg.id);

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
            //$scope.selected = selectedItem;
            // start game/
            queue.endQueue(close);
        }, function () {
            console.log('something happened');
        });
    };

    RoutQueueFactory.prototype.leave = function(room){
    };

    return RoutQueueFactory;
}