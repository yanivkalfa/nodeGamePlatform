module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , _ = _s.oReq.lodash
        ;

    function QueueOut (){}

    QueueOut.prototype.join = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'join',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.joinFail = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'joinFail',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.leave = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'leave',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.leaveFail = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'leaveFail',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.accept = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'accept',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.decline = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'decline',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    QueueOut.prototype.ready = function(spark, q, warrning){
        if(warrning) q.warrning = warrning;
        var data = {
            "m" : 'ready',
            "d" : q
        };

        return spark.write({"m":'queue', d:data});
    };

    return QueueOut;

};