/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
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
            this.myId = queue.users.getMyIndex();
            this.user = queue.users.get(this.myId);
        }

        QueueReadyController.prototype.accept = function(){
            var analysed = QueueOut.analyseMessage("accept " + queue.id + " " + this.myId);
            if(!analysed.success){
                Notify.error(analysed.msg);
            }
        };

        QueueReadyController.prototype.leaveQueue = function(){
            var analysed = QueueOut.analyseMessage("decline " + queue.id +" " + this.myId);
            if(!analysed.success){
                Notify.error(analysed.msg);
            }
        };

        $scope.qready = new QueueReadyController();
    }
})();
