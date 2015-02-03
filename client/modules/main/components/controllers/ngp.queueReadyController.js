/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('queueReadyController', [
        '$scope',
        '$modalInstance',
        'queue',
        'QueueOut',
        'Notify',
        queueReadyController
    ]);

function queueReadyController(
    $scope,
    $modalInstance,
    queue,
    QueueOut,
    Notify
    ) {
    function QueueReadyController(){
        this.queue = queue;
        this.myIndex = queue.getMyIndex();
        this.user = queue.getUser(this.myIndex);
        console.log(this.user);
    }

    QueueReadyController.prototype.accept = function(){
        var analysed = QueueOut.analyseMessage("accept " + queue.id + " " + this.myIndex);
        if(!analysed.success){
            Notify.error(analysed.msg);
        }
    };

    QueueReadyController.prototype.leaveQueue = function(){
        var analysed = QueueOut.analyseMessage("decline " + queue.id +" " + this.myIndex);
        if(!analysed.success){
            Notify.error(analysed.msg);
        }
    };

    $scope.qready = new QueueReadyController();
}