module.exports = function(_s){

    var validation = require(_s.oConfig.pathsList.Validation)();

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