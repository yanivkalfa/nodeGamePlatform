module.exports = function(_s){

    function Validation (details){
        this._s = _s;
        this._isValid = false;

        this.validate(details);
    }

    Validation.prototype = {
        validate : function(details){
            this._isValid = true;
        },
        isValid : function(){
            console.log('aaaa');
            return this._isValid; }

    };


    return Validation;
};