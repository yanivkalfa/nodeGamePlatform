/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .service('Terminal', [
            Terminal
        ]);

    function Terminal() {

        function TerminalFactory(){
            this._commend = "";
            this._arguments = "";
        }


        TerminalFactory.prototype.isMessageACommend = function(msg){
            return (msg.slice(0, 1) == "/") ? msg.slice(1) : false ;
        };

        TerminalFactory.prototype.analyseMessage = function(msg){
            var temp = msg.split(" "), self = this;
            self._commend = temp[0];
            self._arguments = temp.splice(1);

            if(typeof self[self._commend] === 'function'){
                return self[self._commend](self._arguments);
            }

            return {"success":false,"msg":"4004", errorIn: self._commend}
        };

        return TerminalFactory;
    }
})();