module.exports = function(_s, _rf){

    var router = _rf.router
        , _ = _s.oReq.lodash
        ;

    function MsgRouter (_s, Primus, spark){
        router.call(this,_s, Primus, spark);
    }

    MsgRouter.prototype = Object.create(router.prototype);
    MsgRouter.prototype.constructor = MsgRouter;

    MsgRouter.prototype.add = function(spark, args){
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

    MsgRouter.prototype.remove = function(spark, args){

    };


    return MsgRouter;
};