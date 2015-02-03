/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('queueReadyController', [
        '$scope',
        '$modalInstance',
        'queue',
        queueReadyController
    ]);

function queueReadyController(
    $scope,
    $modalInstance,
    queue
    ) {

    console.log('arguments', arguments);

    console.log('queue', queue);
    function QueueReadyController(){
        var self = this;
        this.queue = queue;
    }

    QueueReadyController.prototype.accept = function(user,index){
        //$modalInstance.close($scope.selected.item);
    };

    QueueReadyController.prototype.leaveQueue = function(){
        //$modalInstance.dismiss('cancel');
    };


    return new QueueReadyController();
}