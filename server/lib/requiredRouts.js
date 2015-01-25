
module.exports = function(_s){
    var _ = _s.oReq.lodash;

    _s.oReq.app.use(_s.oReq.bodyParser.json());
    _s.oReq.app.use(_s.oReq.bodyParser.urlencoded({ extended: true }));
    _s.oReq.app.use(_s.oReq.express.static(_s.sClientDirname));


    _s.oReq.app.set('views', _s.sServerDirname + '/tpl');
    _s.oReq.app.set('view engine', "jade");
    _s.oReq.app.engine('jade', _s.oReq.jade.__express);

    _s.oReq.app.get('/ajaxHandler', _.partial(_s.oModules.ajaxHandler, _s));
    _s.oReq.app.post('/ajaxHandler', _.partial(_s.oModules.ajaxHandler, _s));

    _s.oReq.app.get('/contents/:content', function (req, res) {
        console.log('req.session.user', req.session.user);
        if(_s.oConfig.routs.loginRequired(req.params.content)){
            _s.oModules.Authorization.init(req.session.user, _s.oConfig.routs.getRout(req.params.content));
            if(_s.oModules.Authorization.isAuthenticated()){
                res.render(_s.sServerDirname + '/tpl/contents/' + req.params.content + '.jade');
            }else{
                res.render(_s.sServerDirname + '/tpl/contents/restricted' + '.jade');
            }
        }else{
            res.render(_s.sServerDirname + '/tpl/contents/' + req.params.content + '.jade');
        }
    });

    _s.oReq.app.get('/*', function (req, res) {
        res.locals.user = {};
        if(req.session.user){
            res.locals.user = req.session.user;
        }

        res.render('main');
    });

};