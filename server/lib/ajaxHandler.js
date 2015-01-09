// export the class
module.exports = function(req, res, _s, a) {
    console.log(_s, a);
    var _this = this;
    var _ = _s.oReq.lodash;
    this.body = req.body;
    this.result = {
        "msg" : "",
        "success" : false
    };

    this.init = function(){
        return (!_.isUndefined(_this.body.post))
            ? _this[_this.body.method](_this.body.post)
            : _this[_this.body.method]() ;
    };

    this.register = function(post){
        return res.json(post);
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