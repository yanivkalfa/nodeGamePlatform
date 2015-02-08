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
            queueReadyController
        ]);

    function queueReadyController(
        $scope,
        $modalInstance,
        queue,
        QueueOut
        ) {
        function QueueReadyController(){
            this.queue = queue;
            this.myId = queue.users.getMyIndex();
            this.user = queue.users.get(this.myId);
        }

        QueueReadyController.prototype.accept = function(){
            QueueOut.accept(this.queue,this.user);
        };

        QueueReadyController.prototype.leaveQueue = function(){
            var analysed = QueueOut.decline(this.queue,this.user);
        };

        $scope.qready = new QueueReadyController();
    }
})();
