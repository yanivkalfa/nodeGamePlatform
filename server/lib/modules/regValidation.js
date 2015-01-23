module.exports = function(_s){

    var validation = _s.oModules.Validation
        , _ = _s.oReq.lodash
        ;

    function RegValidation (details){
        validation.call(this,details);
    }

    _.assign(RegValidation.prototype, validation.prototype);

    return RegValidation;
};