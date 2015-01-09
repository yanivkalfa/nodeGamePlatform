
module.exports = function(_s){

    _s.oReq.app.use(_s.oReq.bodyParser.json());
    _s.oReq.app.use(_s.oReq.bodyParser.urlencoded({ extended: true }));
    _s.oReq.app.use(_s.oReq.express.static(_s.sClientDirname));


    _s.oReq.app.set('views', _s.sServerDirname + '/tpl');
    _s.oReq.app.set('view engine', "jade");
    _s.oReq.app.engine('jade', _s.oReq.jade.__express);

    /*
    _s.oReq.app.get('/assets/:name', function (req, res) {
        _s.oReq.fs.exists(_s.sClientDirname + '/assets/' + req.params.name, function(exists) {
            if (exists) {
                res.sendFile(_s.sClientDirname + '/assets/' + req.params.name);
            }
            else
            {
                res.status(404).send('404 page !!!!');
            }
        });
    });
    */
    /*
    _s.oReq.app.get("/", function(req, res){
        res.locals.user = {};
        if(req.session.user){
            res.locals.user = req.session.user;
        }

        res.render('main');
    });*/

    /*
    _s.oReq.app.get('/ajaxHandler', function (req, res) {
        console.log('got here');
        res.json({got:'here'});
    });

    _s.oReq.app.post('/ajaxHandler', function (req, res) {
        res.json({got:'here'});
    });*/

    /*
    *
    *
    * */

    _s.oReq.app.get('/ajaxHandler', _s.oReq.ajaxHandler);
    _s.oReq.app.post('/ajaxHandler', _s.oReq.ajaxHandler);

    _s.oReq.app.get('/contents/:content', function (req, res) {
        if(_s.uf.loginRequired(req.params.content)){
            if(_s.uf.isLoggedIn()){
                res.render(_s.sServerDirname + '/tpl/contents/' + req.params.content + '.jade');
            }else{
                res.status(404);
            }
        }else{
            res.render(_s.sServerDirname + '/tpl/contents/' + req.params.content + '.jade');
        }
    });

    _s.oReq.app.post('/login', function (req, res) {
        _s.uf.login(req.body.login).then(function(user){
            if(user)
            {
                user.token = _s.oReq.jwt.sign({ userId : user.id}, _s.oConfig.session.secret, { algorithm: 'HS512'});
                req.session.user = user;
                res.redirect('/');
            }
            else
            {
                res.redirect('/');
            }
        }).catch(function(err){
            if(err) res.redirect('/');
        });
    });
    /*
    _s.oReq.app.get('/register', function (req, res) {
        res.render('register');
    });

    _s.oReq.app.post('/register', function (req, res) {

        User.create(req.body.User).then( function (res) {
            console.log('res', res);
        },  function (err) {
            if(err)console.log('err', err);
        });

        res.redirect('/');
    });*/

    _s.oReq.app.get('/*', function (req, res) {
        res.locals.user = {};
        if(req.session.user){
            res.locals.user = req.session.user;
        }

        res.render('main');
    });

};