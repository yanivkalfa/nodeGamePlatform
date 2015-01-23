module.exports = function(_s){

    function Validation (details){
        this._s = _s;
        this._isValid = false;

        this.validate(details);
    }

    Validation.prototype = {
        validate : function(details){
            console.log('aaa');
            this._isValid = true;
        },
        isValid : function(){
            return this._isValid; }

    };


    return Validation;
};