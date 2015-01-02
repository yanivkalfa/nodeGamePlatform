/*
angular.module(ngp.const.app.name, ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            console.log('asasfasdf');

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
                        controller: 'loginController'
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
                        controller: 'registerController'
                    }
                }
            }).state('admin', {
                url: '/admin',
                resolve: {
                    authorize: ['authorization',
                        function(authorization) {
                            return authorization.authorize();
                        }
                    ]
                },
                data: {
                    roles: ['User']
                },
                views: {
                    'main@': {
                        templateUrl: ngp.const.app.url + '/contents/admin',
                        controller: 'adminController'
                    }
                }
            }).state('game', {
                parent: 'admin',
                url: '/game',
                data: {
                    roles: []
                },
                views: {
                    'main@': {
                        templateUrl: ngp.const.app.url + '/contents/game',
                        controller: 'gameController'
                    }
                }
            }).state('restricted', {
                parent: 'admin',
                url: '/restricted',
                data: {
                    roles: ['Admin']
                },
                views: {
                    'main@': {
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
    ]);*/

