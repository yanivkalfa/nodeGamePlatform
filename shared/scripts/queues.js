(function(){

    var List
        , Queue
        ;

    if (typeof module !== 'undefined' && module.exports) {
        List = require('./list.js');
        Queue = require('./queue.js');
    }else{
        List = window.ngp.oFns.List;
        Queue = window.ngp.oFns.Queue;
    }

    function Queues(){
        List.apply(this,arguments);
    }

    Queues.prototype = Object.create(List.prototype);
    Queues.prototype.constructor = Queues;

    Queues.prototype.add =  function(q){
        var self = this;
        var args = Array.prototype.slice.call(arguments, -1,-1);
        args.push(new Queue(q));
        return List.prototype.add.apply(self, args);
    };

    Queues.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(this.list[id])) return false;
        this.list[id].end('Queue removed');
        return delete self.list[id];
    };

    Queues.prototype.reset =  function(id){
        var self = this;
        if(_.isEmpty(this.list[id])) return false;
        this.list[id].end('Queue removed');
        return delete self.list[id];
    };


    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Queues;
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.Queues = Queues;
            else{
                window.ngp.oFns = {
                    Queues:Queues
                };
            }
    }
})();