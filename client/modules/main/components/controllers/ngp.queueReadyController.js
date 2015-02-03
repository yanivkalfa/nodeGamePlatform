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
    function QueueReadyController(){
        this.queue = queue;
    }

    QueueReadyController.prototype.accept = function(user,index){
        user.accepted = true;
        console.log(user,index);
        //$modalInstance.close($scope.selected.item);
    };

    QueueReadyController.prototype.leaveQueue = function(){
        //$modalInstance.dismiss('cancel');
    };

    $scope.qready = new QueueReadyController();
}