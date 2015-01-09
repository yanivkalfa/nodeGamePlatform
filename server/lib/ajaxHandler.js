// export the class
module.exports = function(_s, req, res) {
    var _this = this;
    var _ = _s.oReq.lodash;
    this.toReturn = _.cloneDeep({
        "status" : 0,
        "success" : false,
        "method" : _this.body.method,
        "data" : {}
    });

    this.body = req.body;
    this.result = {
        "msg" : "",
        "success" : false
    };

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
        User.create(userDetails).then(success,failed);
    };

    this.login = function(post){
        if(post.nickName)
        {
            if(_this.oGlobal.badNickNames.indexOf(post.nickName) === -1)
            {
                if(post.nickName.length < _this.oConfig.maxNickNameLength)
                {
                    _this.result.msg = post.nickName;
                    _this.result.success = true;
                }
                else{
                    _this.result.msg = "The nickname you've chosen is too big max max letter is " + _this.oConfig.maxNickNameLength + "!";
                }
            }
            else
            {
                _this.result.msg = "The nickname you've chosen is taken please select another!";
            }

        }
        else
        {
            _this.result.msg = "Please select nickname !";
        }
    };

    this.init();
};