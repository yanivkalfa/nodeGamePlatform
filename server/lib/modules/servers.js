module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){
        this.visibleField = ["name","port", "address","user"];
    }

    ServersClass.prototype =  {

        parseAddress : function(address){
            var serverDetails = address.split(':');
            if(!_.isArray(serverDetails) || serverDetails.length !== 2) return false;

            return {
                address : serverDetails[0],
                port: serverDetails[1]
            }
        }
    };


    return new ServersClass();
};