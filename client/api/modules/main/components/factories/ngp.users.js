/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Users', [
        'Api',
        usersFactory
    ]);

function usersFactory(
    Api
    ) {

    function UsersFactory(){
        this._user = undefined;
        this.details = {};
    }

    UsersFactory.prototype =  {


        get: function() { return this._user; },
        getDetails : function(){ return this.details; },



        set: function(user) { this._user = user; },
        fetchDetails : function(){ return false;/**/; }

    };

    return UsersFactory;
}