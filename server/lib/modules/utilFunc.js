module.exports = function(_s){
    return {

        extend : function(source,extend){
            for(var key in extend){
                source.prototype[key] = extend[key];
            }
        }

    };
};

