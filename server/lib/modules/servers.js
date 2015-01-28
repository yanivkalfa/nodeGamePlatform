module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){
        this.visibleField = ["name","port", "address","user"];
    }

    ServersClass.prototype =  {

        parseAddress : function(address){
            return address.split(':')
        }
    };


    return new ServersClass();
};