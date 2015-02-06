function Router (){}

Router.prototype =  {

    rout: function(spark, msg, a1, a2, a3, a4, a5){
        var self = this;
        return self[msg.m](spark, msg.d, a1, a2, a3, a4, a5);
    }
};
module.exports = Router;