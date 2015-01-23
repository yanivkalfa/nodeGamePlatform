module.exports = function(_rf){

    var validation = _rf.Validation;

    function RegValidation (details){
        validation.call(this,details);
    }

    RegValidation.prototype = Object.create(validation.prototype);
    RegValidation.prototype.constructor = RegValidation;

    /*
    RegValidation.prototype.isValid = function(){
        console.log('bbbb');

        return validation.prototype.isValid.apply(this, arguments);
    };
    */

    return RegValidation;
};