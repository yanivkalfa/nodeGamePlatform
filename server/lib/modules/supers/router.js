module.exports = function(){

    function Router (){}

    Router.prototype =  {

        rout: function(spark, msg){
            var self = this;
            self[msg.m](spark, msg.d);
        }
    };


    return Router;
};