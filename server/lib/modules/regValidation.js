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

        return _super.apply(this, arguments);
    };

    return RegValidation;
};