(function(){
    angular.module(ngp.const.app.name)
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', siteRouts]);

    function siteRouts($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url: '/',
            data: {
                roles: []
            },
            views: {
                'main@': {
                    templateUrl: ngp.const.app.url + '/contents/home',
                    controller: 'homeController'
                }
            }
        }).state('login', {
            url: '/login',
            data: {
                roles: []
            },
            views: {
                'main@': {
                    templateUrl: ngp.const.app.url + '/contents/login',
                    controller: 'loginController',
                    controllerAs : 'login'
                }
            }
        }).state('register', {
            url: '/register',
            data: {
                roles: []
            },
            views: {
                'main@': {
                    templateUrl: ngp.const.app.url + '/contents/register',
                    controller: 'registerController',
                    controllerAs : 'register'
                }
            }
        }).state('admin', {
            url: '/admin',
            resolve: {
                authorize: ['Authorization',
                    function(Authorization) {
                        return Authorization.init()
                            .then(_.bind(Authorization.authorized, Authorization))
                            .catch(_.bind(Authorization.notAuthorized, Authorization));
                    }
                ],

                games: ['Games',
                    function(Games) {
                        return Games.init().then(function(games){
                            return Games.setGames(games);
                        }).catch(function(err){
                            console.log(err);
                        });
                    }
                ],

                WebSocket: ['$state','WebSocket',
                    function($state, WebSocket) {
                        return WebSocket.init().then(function(WebSocket){
                            return WebSocket;
                        }).catch(function(err){
                            $state.go('login');
                        });
                    }
                ],

                /*ChatIn: ['ChatIn', function(ChatIn) { return ChatIn.init(); } ],*/
                /**/
                Latency: ['Latency', function(Latency) { return Latency.init(); } ]
            },
            data: {
                roles: ['registered']
            },
            views: {
                'main@': {
                    templateUrl: ngp.const.app.url + '/contents/admin',
                    controller: 'adminController',
                    controllerAs : 'admin'
                }
            }
        }).state('game', {
            parent: 'admin',
            url: '/game',
            data: {
                roles: ['registered']
            },
            views: {
                'admin': {
                    templateUrl: ngp.const.app.url + '/contents/game',
                    controller: 'gameController'
                }
            }
        }).state('restricted', {
            parent: 'admin',
            url: '/restricted',
            data: {
                roles: ['registered']
            },
            views: {
                'admin@': {
                    templateUrl: ngp.const.app.url + '/contents/restricted'
                }
            }
        }).state('accessdenied', {
            url: '/denied',
            data: {
                roles: []
            },
            views: {
                'main@': {
                    templateUrl: ngp.const.app.url + '/contents/denied'
                }
            }
        });
    }
})();


