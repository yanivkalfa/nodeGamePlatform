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

    this.register = function(userDetails){
        var success
            , failed
            , wrongUserDetails
            ;

        wrongUserDetails = function(){
            _this._setResp('There was an error with user details', false);
            return res.json(_this.toReturn);
        };
        if(!_s.uf.checkUserDetails(userDetails)) wrongUserDetails();

        success = function(user){
            _this._setResp(user, true);
            return res.json(_this.toReturn);
        };

        failed = function(err){
            if(err)console.log('err', err);
            _this._setResp(err, false);
            return res.json(_this.toReturn);
        };

        delete userDetails.rePassword;
        console.log(userDetails);
        throw new Error(userDetails);

        User.create(userDetails).then(success,failed);
    };

    this.login = function(userDetails){

        _s.uf.login(userDetails).then(function(user){
            if(user)
            {
                var payLoard = { userId : user.id }
                    , options = {
                        algorithm: 'HS512',
                        expiresInMinutes : _s.oConfig.session.maxAge / 1000 / 60
                    };
                user.token = _s.oReq.jwt.sign(payLoard , _s.oConfig.session.secret, options);
                req.session.user = user;
                _this._setResp(user, true);
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