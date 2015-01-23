module.exports = function(_s, _rf){

    var validation = _rf.Validation
        , _ = _s.oReq.lodash
        ;

    function RegValidation (details){
        validation.call(this,details);
    }

    _.assign(RegValidation.prototype, validation.prototype);

    RegValidation.prototype.isValid = function(){
        console.log('bbbb');

        validation.isValid.apply(this);
    };

    return RegValidation;
};