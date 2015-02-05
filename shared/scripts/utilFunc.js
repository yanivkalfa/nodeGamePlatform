
(function(){
    console.log('util funciton happening');
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = new UtilFunc();
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.UtilFunc = new UtilFunc();
            else{
                window.ngp.oFns = {
                    UtilFunc : new UtilFunc()
                };
            }
    }

    function UtilFunc(){}

    UtilFunc.prototype =  {

        formatMsgDate : function(unixDate) { return moment(new Date(unixDate)).format('HH:mm:ss'); },

        indexOf : function(thisArg, index, prop){
            var self = this;
            return self.findIndex.call(thisArg, index, prop);
        },

        findIndex : function(index, prop){
            for(var i = 0; i < this.length; i++){
                if(prop) if(this[i][prop] == index || this[i][prop] == index[prop]) return i;
                if(this[i] == index) return i;
            }
            return -1;
        },

        toArray : function(item){
            if(!item) return false;
            return !_.isArray(item) ? [item] : item;
        },

        concat : function (_s, res) {
            return new _s.oReq.Promise(function(resolve, reject) {
                res.pipe(_s.oReq.concat(function(fullResp) {
                    var statusCode = parseInt(res.statusCode);
                    if(statusCode < 200 || statusCode > 299){
                        return reject('{"error" : "There is some problem with the request status code: '+statusCode+'"}');
                    }else{
                        return resolve(fullResp.toString());
                    }
                }));
            });
        },

        extend : function(source,extend){
            for(var key in extend){
                source.prototype[key] = extend[key];
            }
        }
    };
})();
