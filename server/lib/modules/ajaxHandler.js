// export the class
module.exports = function(_s, req, res) {
    var _this = this;
    var _ = _s.oReq.lodash;

    this.body = req.body;
    this.result = {
        "msg" : "",
        "success" : false
    };

    this.toReturn = _.cloneDeep({
        "status" : 0,
        "success" : false,
        "method" : _this.body.method,
        "data" : {}
    });

    this.init = function(){
        return (!_.isUndefined(_this.body.data))
            ? _this[_this.body.method](_this.body.data)
            : _this[_this.body.method]() ;
    };

    this._setResp = function(data,success){
        _this.toReturn.success = success;
        _this.toReturn.data = data;
    };

    this.authenticateUser = function(userDetails){
        _this._setResp('User is not logged in', false);
        if(req.session.user && userDetails && req.session.user.token == userDetails.token){
            _this._setResp(true, true);
        }
        return res.json(_this.toReturn);
    };

    this.logout = function(){
        _s.oModules.Authorization.logout(req, res);
        _this._setResp(true, true);
        return res.json(_this.toReturn);
    };

    this.register = function(userDetails){
        var success
            , failed
            , wrongUserDetails
            , visibleField = _s.oModules.User.visibleField()
            ;

        wrongUserDetails = function(){
            _this._setResp('There was an error with user details', false);
            return res.json(_this.toReturn);
        };

        var validator = new _s.oModules.RegValidation(userDetails);
        if(!validator.isValid()) wrongUserDetails();

        success = function(user){
            _this._setResp(_.pick(user, visibleField), true);
            return res.json(_this.toReturn);
        };

        failed = function(err){
            if(err)console.log('err', err);
            _this._setResp(err, false);
            return res.json(_this.toReturn);
        };

        delete userDetails.rePassword;
        Users.create(userDetails).then(success,failed);
    };

    this.login = function(userDetails){

        _s.oModules.Authorization.login(userDetails).then(function(user){
            if(user)
            {
                var payLoard = { userId : user.id }
                    , options = {
                        algorithm: 'HS512',
                        expiresInMinutes : _s.oConfig.session.maxAge / 1000 / 60
                    }
                    , visibleField = _s.oModules.User.visibleField()
                    ;

                user.token = _s.oReq.jwt.sign(payLoard , _s.oConfig.session.secret, options);
                req.session.user = _.pick(user, visibleField);
                _this._setResp(_.pick(user, visibleField), true);
                return res.json(_this.toReturn);
            }
            else
            {
                _this._setResp("User with this email does not exist!", false);
                return res.json(_this.toReturn);
            }
        }).catch(function(err){
            _this._setResp("Some Error Occur please try again later", false);
            return res.json(_this.toReturn);
        });
    };

    this.init();
};