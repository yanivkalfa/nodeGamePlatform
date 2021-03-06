
module.exports = function(_s){
    var _ = _s.oReq.lodash
        , sessCon = _s.oConfig.session.connection
        , sessSecret = _s.oConfig.session.secret
        , sessMaxAge = _s.oConfig.session.maxAge
        , pathsList = _s.oConfig.pathsList
        , ajaxHandler = require(pathsList.ajaxHandler)
        ;

    _s.oReq.app.use(_s.oReq.session({
        store: new _s.oReq.RedisStore({
            port : _s.oConfig.connections[sessCon].port,
            host : _s.oConfig.connections[sessCon].host
        }),
        secret: sessSecret,
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: sessMaxAge }
    }));

    _s.oReq.app.use(_s.oReq.bodyParser.json());
    _s.oReq.app.use(_s.oReq.bodyParser.urlencoded({ extended: true }));
    _s.oReq.app.use(_s.oReq.express.static(_s.sClientDirname));

    _s.oReq.app.get('/shared/*', function (req, res) {
        var reqPath = req.params[0];
        if(reqPath.indexOf('..') > -1 || reqPath.indexOf('../') > -1) return res.status(404).send('404 page !!!!');
        _s.oReq.fs.exists(_s.sSharedDirname+ '/' + reqPath, function(exists) {
            if (exists) {
                return res.sendFile(_s.sSharedDirname+ '/' + reqPath);
            }
            else
            {
                return res.status(404).send('404 page !!!!');
            }
        });
    });


    _s.oReq.app.set('views', _s.sServerDirname + '/tpl');
    _s.oReq.app.set('view engine', "jade");
    _s.oReq.app.engine('jade', _s.oReq.jade.__express);

    _s.oReq.app.get('/ajaxHandler', _.partial(ajaxHandler, _s));
    _s.oReq.app.post('/ajaxHandler', _.partial(ajaxHandler, _s));

    _s.oReq.app.get('/contents/:content', function (req, res) {
        return res.render(_s.sServerDirname + '/tpl/contents/' + req.params.content + '.jade');


        /*
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
        }*/
    });

    _s.oReq.app.get('/*', function (req, res) {

        res.locals.user = {};
        if(req.session.user){
            res.locals.user = req.session.user;
        }

        res.render('main');
    });

};