
module.exports = (function(){
    function Validation (details){
        this._isValid = false;
        this.validate(details);
    }

    Validation.prototype = {
        validate : function(details){
            this._isValid = true;
        },
        isValid : function(){
            return this._isValid; }

    };

    return Validation
});