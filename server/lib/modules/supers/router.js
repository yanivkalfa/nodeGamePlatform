function Router (){}

Router.prototype =  {

    rout: function(spark, msg){
        var self = this;
        return self[msg.m](spark, msg.d);
    }
};

module.exports = Router;