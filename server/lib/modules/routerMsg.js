module.exports = function(_rf){

    var router = _rf.Router;

    function RouterMsg (Primus, spark){
        router.call(this,Primus, spark);
    }

    RouterMsg.prototype = Object.create(router.prototype);
    RouterMsg.prototype.constructor = RouterMsg;

    RouterMsg.prototype.add = function(spark, args){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            ;

        switch(args.toType){
            case 'private':
                var toEmit = {
                    "m" : 'msg',
                    "a" : 'add',
                    "d" : {
                        id : dateNow + randomId.toString(),
                        "toType" : 'private',
                        "to" : args[0],
                        "from" : User.get().id,
                        "date" : dateNow,
                        "msg" : args.splice(1).join(" ")
                    }
                };

                break;
            case 'room':
                break;

        }
    };

    RouterMsg.prototype.remove = function(spark, args){

    };


    return RouterMsg;
};