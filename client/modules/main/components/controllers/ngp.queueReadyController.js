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
        this.meIndex = queue.getMeUser();
        this.meUser = queue.getUser(this.meIndex);
    }

    QueueReadyController.prototype.accept = function(user,index){
        //user.accepted = true;
        var analysed = QueueOut.analyseMessage("accept " + queue.id + " " + index);
        if(!analysed.success){
            Notify.error(analysed.msg);
        }
        console.log(user,index);
        //$modalInstance.close($scope.selected.item);
    };

    QueueReadyController.prototype.leaveQueue = function(user,index){
        //user.accepted = false;
        var analysed = QueueOut.analyseMessage("decline " + queue.id +" " + index);
        if(!analysed.success){
            Notify.error(analysed.msg);
        }
        //$modalInstance.dismiss('cancel');
    };

    $scope.qready = new QueueReadyController();
}