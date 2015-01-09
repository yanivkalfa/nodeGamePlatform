// export the class
module.exports = function(req, res) {
    //console.log(a,b,c,d);
    console.log(this);

    return res.json({got:'here'});
    var _this = this;
    this.body = body;
    this.oGlobal = oGlobal;
    this.oConfig = oConfig;
    this.result = {
        "msg" : "",
        "success" : false
    };

    this.init = function(){
        if(typeof _this.body.post !== "undefined")
        {
            _this[_this.body.method](_this.body.post);
        }
        else
        {
            _this[_this.body.method]();
        }


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